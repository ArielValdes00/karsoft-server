import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Employee } from './employee/entities/employee.entity';
import { Wash } from './wash/entities/wash.entity';
import { Mercadopago } from './mercadopago/entities/mercadopago.entity';

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
            sequelize.addModels([User, Employee, Wash, Mercadopago]);
            await sequelize.sync();
            return sequelize;
        },
    },
];