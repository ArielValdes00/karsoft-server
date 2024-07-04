import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        
        const passwordMatch = await bcrypt.compare(pass, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return user.dataValues;
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password, confirm_password, phone_number, business_name, address, postal_code } = createUserDto;
        
        if (password !== confirm_password) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const uniqueMail = await User.findOne({ where: { email: email } });
        if (uniqueMail) {
            throw new BadRequestException('El usuario ya existe');
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
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            sub: user.id, 
            email: user.email, 
            name: user.name, 
            avatar: user.avatar 
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUserById(id: number): Promise<User | null> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }
}
