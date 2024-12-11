import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderServiceHandler } from './order.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderServiceHandler) { }

    @Post(':branchId')
    async create(
        @Param('branchId') branchId: string,
        @Body() createOrderDto: CreateOrderDto
    ) {
        return await this.orderService.create(createOrderDto, branchId);
    }

    @Get(':branchId')
    async findAll(@Param('branchId') branchId: string) {
        return this.orderService.findAll(branchId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.getOrderDetails(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.update(id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(id);
    }
}
