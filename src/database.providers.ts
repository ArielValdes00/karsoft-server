import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Mercadopago } from './mercadopago/entities/mercadopago.entity';
import { Branch } from './branch/entities/branch.entity';
import { UserBranch } from './user-branch/entities/user-branch.entity';
import { Client } from './client/entities/client.entity';
import { Service } from './service/entities/service.entity';
import { Order } from './order/entities/order.entity';
import { OrderService } from './order-service/entities/order-service.entity';
import { PaymentMethod } from './payment-method/entities/payment-method.entity';

dotenv.config();
export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                }
            });
            sequelize.addModels([User, Mercadopago, Branch, UserBranch, Client, Service, Order, OrderService, PaymentMethod]);
            await sequelize.sync({alter:true});
            return sequelize;
        },
    },
];