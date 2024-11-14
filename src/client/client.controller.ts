import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('client')
@UseGuards(JwtAuthGuard)
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post(':branchId')
    create(
        @Param('branchId') branchId: string,
        @Body() createClientDto: CreateClientDto
    ) {
        return this.clientService.create(branchId, createClientDto);
    }

    @Get(':branchId')
    async findAllByBranch(
        @Param('branchId') branchId: string,
        @Query('search') search?: string
    ) {
        return this.clientService.findAllByBranch(branchId, search);
    }

    @Get(':branchId/:id')
    async findOneByBranch(
        @Param('branchId') branchId: string,
        @Param('id') id: string,
    ) {
        return this.clientService.findOneByBranch(branchId, id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientService.update(id, updateClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientService.remove(id);
    }
}
