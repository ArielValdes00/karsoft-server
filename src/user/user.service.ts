import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Branch } from 'src/branch/entities/branch.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
    constructor(private cloudinaryService: CloudinaryService) { }

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }

        await user.update({ password: newPassword });
    }

    async create(createUserDto: CreateUserDto): Promise<string> {
        const { name, email, password, phone_number } = createUserDto;
        const uniqueMail = await User.findOne({ where: { email: email } });
        if (uniqueMail) {
            throw new BadRequestException('El usuario ya existe');
        }
        const user = await User.create({
            name,
            email,
            password,
            phone_number,
            role: "admin"
        });
        return user.id;
    }

    async findAll(role?: string, search?: string): Promise<User[]> {
        const whereConditions: any = {};
    
        if (role) {
            whereConditions.role = role;
        }
    
        if (search) {
            whereConditions.name = { [Op.iLike]: `%${search}%` };
        }
    
        const users = await User.findAll({
            where: whereConditions,
            attributes: { exclude: ['password'] },
            include: [{ model: Branch, through: { attributes: [] } }],
        });
    
        if (!users || users.length === 0) {
            throw new NotFoundException('No se encontraron usuarios');
        }
    
        return users;
    }
    
    async findOne(id: string): Promise<User> {
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
