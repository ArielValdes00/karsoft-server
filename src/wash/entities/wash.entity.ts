import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'washes' })
export class Wash extends Model<Wash> {
    @Column({ type: DataType.STRING, allowNull: false })
    customerName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    carLicensePlate: string;

    @Column({ type: DataType.STRING, allowNull: false })
    phoneNumber: string;

    @Column({ type: DataType.STRING, allowNull: false })
    washType: string;

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: "Sin Empezar" })
    status: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: string;
}
