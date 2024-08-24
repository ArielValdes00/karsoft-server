import { Column, DataType, Default, Table, Model } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'mercadopago_subscriptions' })
export class Mercadopago extends Model<Mercadopago> {
  @Default(uuidv4)
  @Column({ type: DataType.UUID, unique: true })
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
}
