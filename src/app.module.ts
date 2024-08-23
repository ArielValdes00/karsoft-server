import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { databaseProviders } from './database.providers';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { WashModule } from './wash/wash.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [UserModule, AuthModule, EmployeeModule, WashModule, CloudinaryModule, MercadopagoModule],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
  exports: [...databaseProviders]
})
export class AppModule {}
