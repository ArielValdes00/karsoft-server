import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { Op } from 'sequelize';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ServiceService {

    async create(
        createServiceDto: CreateServiceDto,
        branchId: string,
        userId: string
    ): Promise<Service> {
        const service = await Service.create({
            ...createServiceDto,
            branchId,
            created_by: userId,
        });
    
        return service;
    }
    
    findAll() {
        return Service.findAll();
    }

    async findAllByBranchId(
        branchId: string,
        search?: string
    ): Promise<{ count: number; services: Service[] }> {
        const whereCondition = {
            branchId,
            ...(search && { name: { [Op.iLike]: `%${search}%` } })
        };
    
        const services = await Service.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'creator'
                }
            ]
        });
    
        const count = services.length;
    
        return { count, services };
    }    

    findOne(id: string) {
        return `This action returns a #${id} service`;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        const service = await Service.findByPk(id);
    
        if (!service) {
          throw new NotFoundException(`Service with ID #${id} not found`);
        }
    
        await service.update(updateServiceDto);
        return service;
      }
    
      async remove(id: string) {
        const service = await Service.findByPk(id);
    
        if (!service) {
          throw new NotFoundException(`Service with ID #${id} not found`);
        }
    
        await service.destroy();
        return service;
      }
}
