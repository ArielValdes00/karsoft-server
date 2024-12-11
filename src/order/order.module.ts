import { Module } from '@nestjs/common';
import { OrderServiceHandler } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [OrderController],
    providers: [OrderServiceHandler],
})
export class OrderModule { }
