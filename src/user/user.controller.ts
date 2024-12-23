import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UseInterceptors, UploadedFile, Query, Patch } from '@nestjs/common';
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

    @Get(':branchId/:userId')
    async findAll(
        @Param('branchId') branchId: string,
        @Param('userId') userId: string,
        @Query('role') role?: string, @Query('search') search?: string) {
        return this.userService.findAll(role, search, branchId, userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete()
    removeMany(@Body('ids') ids: string[]) {
        return this.userService.removeMany(ids);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.userService.uploadImage(id, file);
    }

    @Patch(':userId')
    async setActiveBranch(
        @Param('userId') userId: string,
        @Body('branchId') branchId: string
    ): Promise<void> {
        return this.userService.setActiveBranch(userId, branchId);
    }
}
