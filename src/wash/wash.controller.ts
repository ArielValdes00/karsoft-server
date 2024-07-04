import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateWashDto } from 'src/wash/dto/create-wash.dto';
import { UpdateWashDto } from 'src/wash/dto/update-wash.dto';
import { WashService } from 'src/wash/wash.service';

@Controller(':userId/wash')
@UseGuards(JwtAuthGuard)
export class WashController {
    constructor(private readonly washService: WashService) {}

    @Post()
    create(@Param('userId') userId: string, @Body() createWashDto: CreateWashDto) {
        return this.washService.create(userId, createWashDto);
    }

    @Get()
    findAll(@Param('userId') userId: string) {
        return this.washService.findAll(userId);
    }

    findOne(@Param('userId') userId: string, @Param('id') id: string) {
        return this.washService.findOne(userId, id);
    }

    @Put(':id')
    update(@Param('userId') userId: string, @Param('id') id: string, @Body() updateWashDto: UpdateWashDto) {
        return this.washService.update(userId, id, updateWashDto);
    }

    @Delete(':id')
    remove(@Param('userId') userId: string, @Param('id') id: string) {
        return this.washService.remove(userId, id);
    }
}
