import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {

    async create(createServiceDto: CreateServiceDto, branchId: string): Promise<Service> {
        const service = await Service.create({ ...createServiceDto, branchId });
        return service;
    }

    findAll() {
        return Service.findAll();
    }

    async findAllByBranchId(branchId: string): Promise<Service[]> {
        const services = await Service.findAll({
            where: { branchId },
        });
    
        if (services.length === 0) {
            throw new NotFoundException(`No services found for branch with ID ${branchId}`);
        }
    
        return services;
    }    

    findOne(id: number) {
        return `This action returns a #${id} service`;
    }

    update(id: number, updateServiceDto: UpdateServiceDto) {
        return `This action updates a #${id} service`;
    }

    remove(id: number) {
        return `This action removes a #${id} service`;
    }
}
