import { Column, DataType, Default, HasMany, Model, Table } from 'sequelize-typescript';
import { Employee } from 'src/employee/entities/employee.entity';
import { UserAuth } from 'src/utils/types';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users' })
export class User extends Model<User> implements UserAuth {
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    uuid: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING, unique: true })
    email: string;

    @Column({ type: DataType.STRING })
    password: string;

    @Column({ type: DataType.STRING })
    phone_number: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

    @Column({ type: DataType.STRING })
    business_name: string;

    @Column({ type: DataType.STRING })
    address: string;

    @Column({ type: DataType.STRING })
    postal_code: string;

    @HasMany(() => Employee)
    employees: Employee[];
}
