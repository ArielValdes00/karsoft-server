import { Column, DataType, Default, Table, Model, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'mercadopago_subscriptions' })
export class Mercadopago extends Model<Mercadopago> {
  @Default(uuidv4)
  @Column({ type: DataType.UUID, unique: true, primaryKey: true })
  uuid: string;

  @Column({ type: DataType.STRING, unique: true })
  preapprovalId: string;

  @Column({ type: DataType.STRING })
  status: string;  

  @Column({ type: DataType.STRING, allowNull: true })
  payerEmail: string; 

  @Column({ type: DataType.FLOAT, allowNull: true })
  amount: number;  

  @Column({ type: DataType.DATE, allowNull: true })
  nextPaymentDate: Date; 

  @Column({ type: DataType.STRING, allowNull: true })
  applicationId: string;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  externalReference: string; 

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string; 
}
