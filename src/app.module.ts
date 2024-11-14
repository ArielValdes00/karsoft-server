import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { databaseProviders } from './database.providers';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { BranchModule } from './branch/branch.module';
import { UserBranchModule } from './user-branch/user-branch.module';
import { ClientModule } from './client/client.module';
import { ServiceModule } from './service/service.module';
import { OrderModule } from './order/order.module';
import { OrderServiceModule } from './order-service/order-service.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';

@Module({
  imports: [UserModule, AuthModule, CloudinaryModule, MercadopagoModule, BranchModule, UserBranchModule, ClientModule, ServiceModule, OrderModule, OrderServiceModule, PaymentMethodModule],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
  exports: [...databaseProviders]
})
export class AppModule {}
