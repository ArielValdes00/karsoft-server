import { Table, Model, Column, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from 'src/order/entities/order.entity';
import { Service } from 'src/service/entities/service.entity';

@Table({ tableName: 'order_services' })
export class OrderService extends Model<OrderService> {
    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID }) 
    orderId: string;

    @ForeignKey(() => Service)
    @Column({ type: DataType.UUID }) 
    serviceId: string; 
}
