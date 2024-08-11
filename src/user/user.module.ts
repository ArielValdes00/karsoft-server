import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [JwtModule, forwardRef(() => AuthModule), CloudinaryModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
