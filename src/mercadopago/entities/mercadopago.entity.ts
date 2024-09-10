import { Column, DataType, Default, Table, Model } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'mercadopago_subscriptions' })
export class Mercadopago extends Model<Mercadopago> {
  @Default(uuidv4)
  @Column({ type: DataType.UUID, unique: true })
  uuid: string;

  @Column({ type: DataType.STRING })
  preapprovalId: string;
}
