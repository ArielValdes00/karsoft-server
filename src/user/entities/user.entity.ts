import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users' })
export class User extends Model {
    @Default(uuidv4)
    @Column({ type: DataType.UUID, unique: true })
    uuid: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar' })
    phone_number: string;

    @Column({ type: 'varchar', allowNull: true })
    avatar: string;

    @Column({ type: 'varchar' })
    business_name: string;

    @Column({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar' })
    postal_code: string;
}
