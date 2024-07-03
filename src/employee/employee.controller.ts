import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('/:userId/employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    create(@Param('userId') userId: string, @Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.create(userId, createEmployeeDto);
    }

    @Get()
    findAll(@Param('userId') userId: string) {
        return this.employeeService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('userId') userId: string, @Param('id') id: string) {
        return this.employeeService.findOne(userId, id);
    }

    @Put(':id')
    update(@Param('userId') userId: string, @Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.update(userId, id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('userId') userId: string, @Param('id') id: string) {
        return this.employeeService.remove(userId, id);
    }
}
