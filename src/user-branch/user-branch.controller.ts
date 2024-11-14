import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBranchService } from './user-branch.service';
import { CreateUserBranchDto } from './dto/create-user-branch.dto';
import { UpdateUserBranchDto } from './dto/update-user-branch.dto';

@Controller('user-branch')
export class UserBranchController {
  constructor(private readonly userBranchService: UserBranchService) {}

  @Post()
  create(@Body() createUserBranchDto: CreateUserBranchDto) {
    return this.userBranchService.create(createUserBranchDto);
  }

  @Get()
  findAll() {
    return this.userBranchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBranchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBranchDto: UpdateUserBranchDto) {
    return this.userBranchService.update(+id, updateUserBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBranchService.remove(+id);
  }
}
