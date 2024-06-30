import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    async create(createUserDto: CreateUserDto): Promise<number> {
        const { name, email, password, phone_number, business_name, address, postal_code } = createUserDto;
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
        return user.id;
    }

    async findAll(): Promise<User[]> {
        const users = await User.findAll();
        if (!users) {
            throw new NotFoundException('No se pudieron encontrar los usuarios');
        }
        return users;
    }

    async findOne(id: number): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`Usuario con nombre ${email} no encontrado`);
        }
        return user;
    }

    async comparePasswords(providedPassword: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compare(providedPassword, storedPassword);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await user.update(updateUserDto);
        return user;
    }

    async remove(id: number): Promise<void> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.destroy();
    }
}
