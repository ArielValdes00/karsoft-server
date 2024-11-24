import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PaymentMethodService {
    async create(
        branchId: string,
        userId: string,
        createPaymentMethodDto: CreatePaymentMethodDto
    ): Promise<PaymentMethod> {
        const paymentMethod = await PaymentMethod.create({
            ...createPaymentMethodDto,
            branchId,                 
            created_by: userId,     
            created_date: new Date(), 
        });

        return paymentMethod;
    }


    async findAll(branchId: string): Promise<{ count: number; paymentMethods: PaymentMethod[] }> {
        const { count, rows: paymentMethods } = await PaymentMethod.findAndCountAll({
            where: { branchId },
            include: [
                {
                  model: User, // El modelo que corresponde al usuario
                  attributes: ['name'], // Otras propiedades que desees devolver
                  as: 'creator' // Asegúrate de tener una relación definida entre PaymentMethod y User
                }
              ]
        });

        return { count, paymentMethods };
    }

    async findOne(id: string): Promise<PaymentMethod> {
        const paymentMethod = await PaymentMethod.findByPk(id);

        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }

        return paymentMethod;
    }

    async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
        const paymentMethod = await this.findOne(id);
        await paymentMethod.update(updatePaymentMethodDto);
        return paymentMethod;
    }

    async remove(id: string): Promise<void> {
        const paymentMethod = await this.findOne(id);
        await paymentMethod.destroy();
    }
}
