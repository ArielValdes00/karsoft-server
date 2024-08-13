import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly employeeService: EmployeeService,
        private readonly mailService: MailService,
    ) { }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
          const { email } = this.jwtService.verify(token);
          const user = await this.userService.findByEmail(email);
          if (!user) {
            throw new NotFoundException('User not found');
          }
      
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await this.userService.updatePassword(user.id, hashedPassword);
        } catch (error) {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        const token = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
    
        const resetUrl = `http://tudominio.com/reset-password?token=${token}`;
        await this.mailService.sendResetPasswordEmail(user.email, resetUrl);
      }

    private async isEmailUnique(email: string): Promise<boolean> {
        const user = await this.userService.findByEmail(email);
        const employee = await this.employeeService.findByEmail(email);
        return !user && !employee;
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, confirm_password, phone_number, business_name, address, postal_code } = createUserDto;

        if (password !== confirm_password) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const isUnique = await this.isEmailUnique(email);
        if (!isUnique) {
            throw new BadRequestException('El correo electrónico ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            business_name,
            address,
            postal_code,
        });
        return user;
    }

    async login(email: string, password: string) {
        let user = await this.userService.findByEmail(email);
        let userType = 'user';
        
        if (!user) {
            user = await this.employeeService.findByEmail(email);
            userType = 'employee';
        }
        
        if (!user) {
            throw new UnauthorizedException('Usuario o empleado no encontrado');
        }
    
        if (userType === 'employee') {
            if (user.status === 'inactivo') {
                throw new UnauthorizedException('El empleado está inactivo y no puede iniciar sesión');
            }
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            type: userType,
        };
        
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    
    

    async validateUser(userId: any, userType: string) {
        if (userType === 'user') {
            return this.userService.findOne(userId);
        } else if (userType === 'employee') {
            return this.employeeService.getOne(userId);
        }
        return null;
    }
}
