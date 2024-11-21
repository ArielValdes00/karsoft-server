import { Column, DataType, Default, Table, Model, HasMany, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { Client } from 'src/client/entities/client.entity';
import { PaymentMethod } from 'src/payment-method/entities/payment-method.entity';
import { Service } from 'src/service/entities/service.entity';
import { UserBranch } from 'src/user-branch/entities/user-branch.entity';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'branch' })
export class Branch extends Model<Branch> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.STRING, unique: true })
    name: string;

    @Column({ type: DataType.STRING })
    address: string;

    @Column({ type: DataType.STRING })
    postal_code: string; 

    @Column({ type: DataType.STRING })
    neighborhood: string;

    @Column({ type: DataType.STRING })
    province: string;

    @Column({ type: DataType.STRING })
    country: string;

    @BelongsToMany(() => User, () => UserBranch)
    users: User[];

    @HasMany(() => Service)
    services: Service[];

    @HasMany(() => Client) 
    clients: Client[];

    @HasMany(() => PaymentMethod)
    paymentMethods: PaymentMethod[];
}
