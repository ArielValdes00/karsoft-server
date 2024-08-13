import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor(private cloudinaryService: CloudinaryService) {} 

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const user = await User.findByPk(userId);
        if (!user) {
          throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
      }

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

    async findByEmail(email: string): Promise<any> {
        return User.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
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

    async uploadImage(id: number, file: Express.Multer.File): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
    
        try {
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            const imageUrl = uploadResult.secure_url;
            await user.update({ avatar: imageUrl });
            return user;
        } catch (error) {
            throw new BadRequestException(`Error subiendo la imagen: ${error.message}`);
        }
    }
    
}
