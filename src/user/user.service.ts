import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Branch } from 'src/branch/entities/branch.entity';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

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
        const { name, lastname, email, password, phone_number, role } = createUserDto;

        const uniqueMail = await User.findOne({ where: { email: email } });
        if (uniqueMail) {
            throw new BadRequestException('El usuario ya existe');
        }

        const validatedRole = role || 'user';
        if (!['owner', 'admin', 'user'].includes(validatedRole)) {
            throw new BadRequestException('Rol no válido');
        }

        const user = await User.create({
            name,
            lastname,
            email,
            password,
            phone_number,
            role: validatedRole, 
        });

        return user.id;
    }

    async createUserByAdminOrOwner(createUserDto: CreateUserDto, creatorId: string, branchId: string): Promise<any> {
        const { name, lastname, email, password, phone_number } = createUserDto;
    
        const creator = await User.findOne({ where: { id: creatorId } });
        if (!creator) {
            throw new NotFoundException(`Usuario con ID ${creatorId} no encontrado`);
        }
    
        if (creator.role !== 'admin' && creator.role !== 'owner') {
            throw new UnauthorizedException('No tienes permisos para crear usuarios');
        }
    
        const isUnique = await this.isEmailUnique(email);
        if (!isUnique) {
            throw new BadRequestException('El correo electrónico ya está en uso');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await User.create({
            name,
            lastname,
            email,
            password: hashedPassword,
            phone_number,
            role: 'user',
        });
    
        const branch = await Branch.findOne({ where: { id: branchId } });
        if (!branch) {
            throw new NotFoundException(`Branch con ID ${branchId} no encontrado`);
        }
    
        await user.$set('branches', [branchId]); 
    
        return user;
    }
    
    private async isEmailUnique(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return !user;
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

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.update(updateUserDto);
        return user;
    }

    async remove(id: string): Promise<void> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.destroy();
    }

    async uploadImage(id: string, file: Express.Multer.File): Promise<User> {
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
