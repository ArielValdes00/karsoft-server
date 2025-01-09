import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import * as dotenv from 'dotenv';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailModule } from './mail.module';

dotenv.config();
@Module({
    imports: [
        PassportModule,
        CloudinaryModule,
        MailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '10y' },
        }),
    ],
    providers: [AuthService, JwtStrategy, UserService],
    controllers: [AuthController],
    exports: [JwtModule]
})
export class AuthModule { }
