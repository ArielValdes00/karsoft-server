import { Column, DataType, Default, Table, Model, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Branch } from 'src/branch/entities/branch.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from 'src/order-service/entities/order-service.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'services' })
export class Service extends Model<Service> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.FLOAT })
    price: number;

    @Column({
        type: DataType.ENUM,
        values: ['activo', 'inactivo'],
        allowNull: false,
    })
    status: "activo" | "inactivo";

    @ForeignKey(() => Branch)
    @Column({ type: DataType.UUID })
    branchId: string;

    @BelongsTo(() => Branch)
    branch: Branch;

    @BelongsToMany(() => Order, () => OrderService)
    orders: Order[];

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    created_by: string;

    @BelongsTo(() => User)
    creator: User;
}
