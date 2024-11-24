import { Column, DataType, Default, Table, Model, PrimaryKey, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Order } from 'src/order/entities/order.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'payment_methods' })
export class PaymentMethod extends Model<PaymentMethod> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    discount: number;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    extra: number;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    created_date: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    created_by: string;

    @BelongsTo(() => User)
    creator: User;

    @HasMany(() => Order)
    orders: Order[];

    @ForeignKey(() => Branch)
    @Column({ type: DataType.UUID, allowNull: false })
    branchId: string;

    @BelongsTo(() => Branch)
    branch: Branch;
}
