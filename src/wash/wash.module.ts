import { Module } from '@nestjs/common';
import { WashService } from './wash.service';
import { WashController } from './wash.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [JwtModule, AuthModule],
    controllers: [WashController],
    providers: [WashService],
})
export class WashModule { }
