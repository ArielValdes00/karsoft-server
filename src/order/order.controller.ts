import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

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
        return this.orderService.findOne(id);
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
