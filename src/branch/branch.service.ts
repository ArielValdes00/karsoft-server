import { Injectable, NotFoundException } from '@nestjs/common';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { User } from 'src/user/entities/user.entity';
import { UserBranch } from 'src/user-branch/entities/user-branch.entity';
import { Op } from 'sequelize';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class BranchService {
    constructor(
    ) { }

    async create(createBranchDto: CreateBranchDto, userId: string): Promise<Branch> {
        try {
            const existingBranch = await Branch.findOne({
                where: { name: createBranchDto.name }
            });
    
            if (existingBranch) {
                throw new Error('A branch with this name already exists');
            }
    
            const branch = await Branch.create(createBranchDto);
    
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }
    
            await UserBranch.create({
                userId: userId,
                branchId: branch.id
            });
    
            return branch;
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(
        userId: string,
        search?: string
    ): Promise<{ count: number; branches: Branch[]; total_clients: number; total_users: number }> {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Branch,
                    through: { attributes: [] },
                    where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
                },
            ],
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const count = user.branches.length;

        const total_clients = await Client.count({
            include: [
                {
                    model: Branch,
                    required: true,
                    include: [
                        {
                            model: User,
                            where: { id: userId },
                        },
                    ],
                },
            ],
        });

        const total_users = await User.count({
            include: [
                {
                    model: Branch,
                    where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
                    required: true,
                },
            ],
            distinct: true,
        });

        return {
            count,
            branches: user.branches,
            total_clients,
            total_users,
        };
    }
      
    async findAll(): Promise<Branch[]> {
        return Branch.findAll();
    }

    async findOne(id: string): Promise<Branch> {
        const branch = await Branch.findOne({
            where: { id: id },
        });
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }
        return branch;
    }

    async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
        const branch = await Branch.findOne({
            where: { id: id },
        });

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        return branch.update(updateBranchDto);
    }


    async remove(id: string): Promise<void> {
        const branch = await Branch.findOne({
            where: { id: id },
        });

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        await branch.destroy();
    }

}
