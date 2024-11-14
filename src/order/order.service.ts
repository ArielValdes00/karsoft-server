import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Service } from 'src/service/entities/service.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entities/user.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class OrderService {
    async create(createOrderDto: CreateOrderDto, branchId: string) {
        const client = await Client.findByPk(createOrderDto.clientId);
        if (!client) {
            throw new NotFoundException(`Client not found with ID ${createOrderDto.clientId}`);
        }

        const paymentMethod = await PaymentMethod.findByPk(createOrderDto.paymentMethodId);
        if (!paymentMethod) {
            throw new NotFoundException(`Payment Method not found with ID ${createOrderDto.paymentMethodId}`);
        }

        const user = await User.findByPk(createOrderDto.userId);
        if (!user) {
            throw new NotFoundException(`User not found with ID ${createOrderDto.userId}`);
        }

        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            throw new NotFoundException(`Branch not found with ID ${branchId}`);
        }

        const serviceIds = Array.isArray(createOrderDto.serviceId)
            ? createOrderDto.serviceId
            : [createOrderDto.serviceId];

        const services = await Service.findAll({
            where: {
                id: serviceIds,
                status: 'active',
            },
        });

        if (services.length !== serviceIds.length) {
            throw new NotFoundException('One or more services not found or inactive');
        }

        const order = await Order.create({
            ...createOrderDto,
            branchId,
        });

        await order.$set('services', services);

        return order;
    }

    async findAll() {
        const orders = await Order.findAll({
            include: [
                { model: Client },
                { model: PaymentMethod },
                { model: User },
                { model: Branch },
                { model: Service },
            ]
        });
        return orders;
    }

    async findOne(id: string) {
        const order = await Order.findByPk(id, {
            include: [
                { model: Client },
                { model: PaymentMethod },
                { model: User },
                { model: Branch },
                { model: Service },
            ]
        });
        if (!order) {
            throw new NotFoundException(`Order not found with ID ${id}`);
        }
        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFoundException(`Order not found with ID ${id}`);
        }

        await order.update(updateOrderDto);

        return order;
    }

    async remove(id: string) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFoundException(`Order not found with ID ${id}`);
        }

        await order.destroy();

        return { message: `Order with ID ${id} has been removed` };
    }
}
