import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post(':branchId/:creatorId')
    async createUser(
        @Param('branchId') branchId: string,
        @Param('creatorId') creatorId: string,
        @Body() createUserDto: CreateUserDto 
    ) {
        return this.userService.createUserByAdminOrOwner(createUserDto, creatorId, branchId);
    }

    @Get()
    async findAll(@Query('role') role?: string, @Query('search') search?: string) {
        return this.userService.findAll(role, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.userService.uploadImage(id, file);
    }
}
