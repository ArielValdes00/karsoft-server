import { forwardRef, Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController, SpecificEmployeeController } from './employee.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [JwtModule, forwardRef(() => AuthModule), CloudinaryModule],
    controllers: [EmployeeController, SpecificEmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService], 
})
export class EmployeeModule { }
