import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
    async create(userId: string, createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        try {
            const employee = await Employee.create({ ...createEmployeeDto, userId });
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
}
