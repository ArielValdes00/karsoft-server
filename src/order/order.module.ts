import { Module } from '@nestjs/common';
import { OrderServiceHandler } from './order.service';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderServiceHandler],
})
export class OrderModule {}
