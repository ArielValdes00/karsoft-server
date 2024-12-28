import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Service } from 'src/service/entities/service.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entities/user.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Client } from 'src/client/entities/client.entity';
import { OrderService } from 'src/order-service/entities/order-service.entity';

@Injectable()
export class OrderServiceHandler {
    async create(createOrderDto: CreateOrderDto, branchId: string) {
        try {
            const client = await Client.findByPk(createOrderDto.clientId);
            if (!client) {
                throw new NotFoundException(`Client not found with ID ${createOrderDto.clientId}`);
            }
    
            const paymentMethod = await PaymentMethod.findByPk(createOrderDto.paymentMethodId);
            if (!paymentMethod) {
                throw new NotFoundException(`Payment Method not found with ID ${createOrderDto.paymentMethodId}`);
            }
    
            const discount = createOrderDto.paymentDiscount || paymentMethod.discount;
            const extra = createOrderDto.paymentExtra || paymentMethod.extra;
    
            const user = await User.findByPk(createOrderDto.userId);
            if (!user) {
                throw new NotFoundException(`User not found with ID ${createOrderDto.userId}`);
            }
    
            const branch = await Branch.findByPk(branchId);
            if (!branch) {
                throw new NotFoundException(`Branch not found with ID ${branchId}`);
            }
    
            const servicesWithDescriptions = Array.isArray(createOrderDto.serviceId)
                ? createOrderDto.serviceId.map((id, index) => ({
                      id,
                      description: createOrderDto.serviceDescriptions?.[index] || null,
                  }))
                : [{ id: createOrderDto.serviceId, description: createOrderDto.serviceDescriptions?.[0] || null }];
    
            const serviceIds = servicesWithDescriptions.map(service => service.id);
    
            const services = await Service.findAll({
                where: { id: serviceIds },
            });
    
            if (services.length !== serviceIds.length) {
                throw new NotFoundException('One or more services not found or inactive');
            }

            const metadata = {
                client: client.toJSON(),
                paymentMethod: paymentMethod.toJSON(),
                user: user.toJSON(),
                branch: branch.toJSON(),
                services: services.map(service => service.toJSON()),
            };
    
            const order = await Order.create({
                ...createOrderDto,
                branchId,
                discount, 
                extras: extra, 
                metadata
            });
    
            await Promise.all(
                servicesWithDescriptions.map(async service => {
                    await OrderService.create({
                        orderId: order.id,
                        serviceId: service.id,
                        serviceDescription: service.description,
                    });
                }),
            );
    
            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('An unexpected error occurred while creating the order');
        }
    }        

    async findAll(branchId: string) {
        const orders = await Order.findAll({
            where: { branchId },
            include: [
                { model: Client },
                { model: PaymentMethod },
                { model: User },
                { model: Branch },
                { model: Service },
            ],
        });
    
        return orders;
    }    

    async getOrderDetails(orderId: string) {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Client, 
                    as: 'client',
                },
                {
                    model: PaymentMethod, 
                    as: 'paymentMethod',
                },
                {
                    model: User, 
                    as: 'user',
                },
                {
                    model: Branch, 
                    as: 'branch',
                },
                {
                    model: Service, 
                    as: 'services',
                    through: {
                        attributes: ['serviceDescription'],
                    },
                },
            ],
        });
    
        if (!order) {
            throw new NotFoundException(`Order not found with ID ${orderId}`);
        }
    
        return order;
    }    

    async update(id: string, updateOrderDto: any) {
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
