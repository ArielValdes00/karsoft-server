import { Column, DataType, Default, Table, Model, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { Service } from 'src/service/entities/service.entity';
import { OrderService } from 'src/order-service/entities/order-service.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Branch } from 'src/branch/entities/branch.entity';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.FLOAT })
    discount: number;

    @Column({ type: DataType.STRING })
    extras: string;

    @Column({ type: DataType.FLOAT })
    subtotal: number;

    @Column({ type: DataType.FLOAT })
    total: number;

    @ForeignKey(() => PaymentMethod)
    @Column({ type: DataType.UUID })
    paymentMethodId: string;

    @BelongsTo(() => PaymentMethod)
    paymentMethod: PaymentMethod;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @ForeignKey(() => Client)
    @Column({ type: DataType.UUID })
    clientId: string;

    @ForeignKey(() => Branch)
    @Column({ type: DataType.UUID })
    branchId: string;

    @BelongsTo(() => Branch)
    branch: Branch;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Client)
    client: Client;

    @BelongsToMany(() => Service, () => OrderService)
    services: Service[];
}
