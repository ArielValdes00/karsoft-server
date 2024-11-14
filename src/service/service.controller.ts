import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post(':branchId')
    async create(
        @Param('branchId') branchId: string,
        @Body() createServiceDto: CreateServiceDto
    ) {
        return this.serviceService.create(createServiceDto, branchId);
    }

    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    @Get('buildings/:branchId')
    async findAllByBranchId(@Param('branchId') branchId: string) {
        return this.serviceService.findAllByBranchId(branchId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.serviceService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.serviceService.update(+id, updateServiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.serviceService.remove(+id);
    }
}
