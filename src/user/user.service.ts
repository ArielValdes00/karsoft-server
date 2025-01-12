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

    async updatePassword(userId: string, newPassword: string): Promise<void> {
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

        const validatedRole = role || 'empleado';
        if (!['dueño', 'admin', 'empleado'].includes(validatedRole)) {
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
        const { name, lastname, email, password, phone_number, role, status } = createUserDto;

        const creator = await User.findOne({ where: { id: creatorId } });
        if (!creator) {
            throw new NotFoundException(`Usuario con ID ${creatorId} no encontrado`);
        }

        if (creator.role !== 'admin' && creator.role !== 'dueño') {
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
            role,
            status
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

    async findAll(role?: string, search?: string, branchId?: string, userId?: string) {
        const whereConditions: any = {
            '$branches.id$': branchId, 
        };
    
        if (role) {
            whereConditions.role = role;
        }
    
        if (search) {
            whereConditions.name = { [Op.iLike]: `%${search}%` };
        }
    
        if (userId) {
            whereConditions.id = { [Op.ne]: userId }; 
        }
    
        const users = await User.findAll({
            where: whereConditions,
            attributes: { exclude: ['password'] },  
            include: [
                {
                    model: Branch,
                    through: { attributes: [] }, 
                },
            ],
        });
    
        if (!users || users.length === 0) {
            throw new NotFoundException('No se encontraron usuarios para esta sucursal');
        }
    
        return users;
    }    

    async findOne(id: string): Promise<User> {
        const user = await User.findByPk(id, {
            include: [
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: ['name'],
                },
            ],
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<any> {
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Branch,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                },
            ],
        });

        return user
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.update(updateUserDto);
        return user;
    }

    async removeMany(ids: string[]): Promise<void> {
        const users = await User.findAll({ where: { id: ids } });
        if (users.length !== ids.length) {
            throw new NotFoundException(`Algunos usuarios no fueron encontrados.`);
        }
        await User.destroy({ where: { id: ids } });
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

    async setActiveBranch(userId: string, branchId: string): Promise<void> {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
        }

        await user.update({ currentBranchId: branchId });
    }

}
