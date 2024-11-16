import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
      app.enableCors({
        origin: true, // Permite todos los orígenes (útil para desarrollo, pero no recomendado en producción).
        credentials: true, // Si estás usando cookies, habilita esto.
    });
    await app.listen(process.env.PORT || 4000);
}
bootstrap();