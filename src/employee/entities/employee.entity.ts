import { INTEGER } from 'sequelize';
import { Column, DataType, Default, ForeignKey, Model, Table, BelongsTo, BeforeSave } from 'sequelize-typescript';
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
    phone_number: string;

    @Column({ type: DataType.STRING })
    business_name: string;

    @Column({ type: DataType.STRING })
    address: string;

    @Column({ type: DataType.STRING })
    postal_code: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatar: string;

    @Column({ type: DataType.STRING })
    status: 'activo' | 'inactivo';

    @Column({ type: DataType.STRING })
    role: string;

    @ForeignKey(() => User)
    @Column({ type: INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @BeforeSave
    static async syncFields(instance: Employee) {
        if (instance.userId) {
            const user = await User.findByPk(instance.userId);
            if (user) {
                instance.business_name = user.business_name || instance.business_name;
                instance.address = user.address || instance.address;
                instance.postal_code = user.postal_code || instance.postal_code;
            }
        }
    }
}
