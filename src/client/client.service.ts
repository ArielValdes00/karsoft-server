import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { Op } from 'sequelize';

@Injectable()
export class ClientService {
    async create(branchId: string, createClientDto: CreateClientDto) {
        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        const client = await Client.create({
            ...createClientDto,
            branchId: branchId
        });
        return client;
    }

    async findAllByBranch(
        branchId: string,
        search?: string
    ): Promise<{ count: number; clients: Client[] }> {
        const whereCondition = {
            branchId,
            ...(search && { name: { [Op.iLike]: `%${search}%` } })
        };

        const clients = await Client.findAll({ where: whereCondition });

        const count = clients.length;

        return { count, clients };
    }

    async findOneByBranch(branchId: string, id: string) {
        const client = await Client.findOne({ where: { id, branchId } });
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found in branch with ID ${branchId}`);
        }
        return client;
    }

    findAll() {
        const client = Client.findAll()
        return client;
    }

    findOne(id: string) {
        return `This action returns a #${id} client`;
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        const client = await Client.findByPk(id);
    
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
    
        await client.update(updateClientDto);
    
        return client;
    }    

    async remove(ids: string[]): Promise<void> {
        const users = await Client.findAll({ where: { id: ids } });
        if (users.length !== ids.length) {
            throw new NotFoundException(`Algunos usuarios no fueron encontrados.`);
        }
        await Client.destroy({ where: { id: ids } });
    }    

}
