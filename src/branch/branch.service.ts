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
            const user = await User.findByPk(userId, {
                include: [{ model: Branch, through: { attributes: [] } }],
            });
    
            if (!user) {
                throw new NotFoundException('User not found');
            }
    
            let ownerId: string;
    
            if (user.branches && user.branches.length > 0) {
                const owner = await User.findOne({
                    include: [{
                        model: Branch,
                        through: { attributes: [] },
                        where: { id: user.branches[0].id },
                    }],
                    where: { role: 'dueño' },
                });
    
                if (!owner) {
                    throw new Error('No owner found for the existing branch');
                }
    
                ownerId = owner.id;
            } else {
                ownerId = userId;
    
                if (user.role !== 'dueño') {
                    user.role = 'dueño';
                    await user.save();
                }
            }
    
            const branch = await Branch.create(createBranchDto);
    
            await UserBranch.create({
                userId: ownerId,
                branchId: branch.id,
            });
    
            if (userId !== ownerId) {
                await UserBranch.create({
                    userId: userId,
                    branchId: branch.id,
                });
            }
    
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
