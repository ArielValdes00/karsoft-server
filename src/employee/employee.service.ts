import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { EmployeeAuth } from 'src/utils/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EmployeeService {
    constructor(private cloudinaryService: CloudinaryService) {} 

    async create(userId: string, createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        console.log(createEmployeeDto.password)
        try {
            const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
            const employee = await Employee.create({
                ...createEmployeeDto,
                password: hashedPassword,
                userId,
            });
            return employee;
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el empleado');
        }
    }

    async findAll(userId: string): Promise<Employee[]> {
        const employees = await Employee.findAll({ where: { userId } });
        if (!employees || employees.length === 0) {
            throw new NotFoundException('No se pudieron encontrar los empleados');
        }
        return employees;
    }

    async findOne(userId: string, id: string): Promise<Employee> {
        const employee = await Employee.findOne({ where: { id, userId } });
        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return employee;
    }

    async getOne(id: string): Promise<any> {
        const employee = await Employee.findOne({ where: { id } });
        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
        }
        return employee;
    }

    async findByEmail(email: string): Promise<EmployeeAuth | null> {
        return Employee.findOne({ where: { email } }) as unknown as EmployeeAuth;
    }

    async update(userId: string, id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const employee = await this.findOne(userId, id);
        try {
            await employee.update({ ...updateEmployeeDto });
            return employee;
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el empleado');
        }
    }

    async remove(userId: string, id: string): Promise<void> {
        const employee = await this.findOne(userId, id);
        try {
            await employee.destroy();
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el empleado');
        }
    }

    async uploadImage(userId: string, id: number, file: Express.Multer.File): Promise<Employee> {
        const employee = await Employee.findOne({ where: { id, userId } });
        if (!employee) {
            throw new NotFoundException(`Empleado con ID ${id} no encontrado o no pertenece al usuario.`);
        }
   
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const imageUrl = uploadResult.secure_url;
   
        await employee.update({ avatar: imageUrl });
   
        return employee;
    }
   
}
