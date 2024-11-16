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
        origin: (origin, callback) => {
          const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:4000'];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'), false);
          }
        },
      });
      
    await app.listen(process.env.PORT || 4000);
}
bootstrap();