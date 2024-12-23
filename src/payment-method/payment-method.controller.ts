import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('payment-method')
@UseGuards(JwtAuthGuard)
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) { }

    @Post(':branchId/:userId')
    create(
        @Param('branchId') branchId: string,
        @Param('userId') userId: string,
        @Body() createPaymentMethodDto: CreatePaymentMethodDto
    ) {
        return this.paymentMethodService.create(branchId, userId, createPaymentMethodDto);
    }

    @Get(':branchId')
    findAll(@Param('branchId') branchId: string) {
        return this.paymentMethodService.findAll(branchId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentMethodService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        return this.paymentMethodService.update(id, updatePaymentMethodDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.paymentMethodService.remove(id);
    }
}
