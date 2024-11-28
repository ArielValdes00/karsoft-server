import { Column, DataType, Default, Table, Model, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import { Branch } from 'src/branch/entities/branch.entity';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'clients' })
export class Client extends Model<Client> {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    id: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING, unique: true })
    email: string;

    @Column({ type: DataType.STRING })
    phone_number: string;

    @Column({ type: DataType.STRING })
    patent: string;

    @Column({ type: DataType.STRING })
    car_model: string;

    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
    last_visited: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Branch)
    @Column({ type: DataType.UUID })
    branchId: string;

    @BelongsTo(() => Branch)
    branch: Branch;
}
