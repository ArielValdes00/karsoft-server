import { INTEGER } from 'sequelize';
import { Column, DataType, Default, ForeignKey, Model, Table, BelongsTo  } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { EmployeeAuth } from 'src/utils/types';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'employees' })
export class Employee extends Model<Employee> implements EmployeeAuth {
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    uuid: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    password: string;

    @Column({ type: DataType.STRING, unique: true })
    email: string;

    @Column({ type: DataType.STRING })
    status: 'activo' | 'inactivo';

    @Column({ type: DataType.STRING })
    role: string;

    @ForeignKey(() => User)
    @Column({ type: INTEGER })
    userId: string;

    @BelongsTo(() => User)
    user: User;
}
