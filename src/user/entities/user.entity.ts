import { Column, DataType, Default, Table, Model, ForeignKey, BelongsTo, HasMany, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Branch } from 'src/branch/entities/branch.entity';
import { UserBranch } from 'src/user-branch/entities/user-branch.entity';
import { Client } from 'src/client/entities/client.entity';
import { Order } from 'src/order/entities/order.entity';

@Table({ tableName: 'users' })
export class User extends Model<User> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    lastname: string;

    @Column({ type: DataType.STRING, unique: true })
    email: string;

    @Column({ type: DataType.STRING })
    password: string;

    @Column({ type: DataType.STRING })
    avatar: string;

    @Column({ type: DataType.STRING })
    phone_number: string;

    @Column({
        type: DataType.ENUM,
        values: ["activo", "inactivo"],
        allowNull: false,
        defaultValue: "activo"
    })
    status: "activo" | "inactivo";

    @BelongsToMany(() => Branch, () => UserBranch)
    branches: Branch[];

    @Column({
        type: DataType.ENUM,
        values: ['owner', 'admin', 'user'],
        allowNull: false,
    })
    role: "owner" | "admin" | "user";    

    @HasMany(() => Client)
    clients: Client[];

    @HasMany(() => Order)
    orders: Order[];
}
