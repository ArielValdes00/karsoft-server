import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from './mail.service';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ ok: boolean }> {
        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        try {
            const { email, userType } = this.jwtService.verify(token);

            let user: any;

            if (userType === 'user') {
                user = await this.userService.findByEmail(email);
            }

            if (!user) {
                throw new NotFoundException('User or employee not found');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            if (userType === 'user') {
                await this.userService.updatePassword(user.id, hashedPassword);
            }

            return { ok: true };

        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    async forgotPassword(email: string): Promise<{ ok: boolean }> {
        let user = await this.userService.findByEmail(email);
        let userType = 'user';

        if (!user) {
            throw new NotFoundException('Invalid credentials');
        }

        const token = this.jwtService.sign({ email: user.email, userType }, { expiresIn: '1h' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.mailService.sendResetPasswordEmail(user.email, resetUrl);

        return { ok: true };
    }

    private async isEmailUnique(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email);
        return !user;
    }

    async register(createUserDto: CreateUserDto): Promise<any> {
        const { name, lastname, email, password, confirm_password, phone_number } = createUserDto;

        if (password !== confirm_password) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const isUnique = await this.isEmailUnique(email);
        if (!isUnique) {
            throw new BadRequestException('El correo electrónico ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userService.create({
            name,
            lastname,
            email,
            password: hashedPassword,
            phone_number,
            role: "dueño",
        });
        return user;
    }

    async login(email: string, password: string) {
        let user = await this.userService.findByEmail(email);
    
        if (!user) {
            throw new UnauthorizedException('No hay email');
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('La contra no es');
        }
    
        let currentBranchId = user.currentBranchId;
    
        if (!currentBranchId && user.branches && user.branches.length > 0) {
            currentBranchId = user.branches[0].id;
            await this.userService.setActiveBranch(user.id, currentBranchId);
        }
    
        const branchesInfo = user.branches.map(branch => ({
            id: branch.id,
            name: branch.name,
        }));
    
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            currentBranchId: currentBranchId,
            branches: branchesInfo,
        };
    
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
