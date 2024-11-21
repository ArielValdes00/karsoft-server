import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('buildings')
@UseGuards(JwtAuthGuard)
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Post(':userId')
    async create(
        @Param('userId') userId: string,
        @Body() createBranchDto: CreateBranchDto
    ) {
        return this.branchService.create(createBranchDto, userId);
    }

    @Get()
    findAll() {
        return this.branchService.findAll();
    }

    @Get(':userId')
    async findAllByUserId(@Param('userId') userId: string) {
        return this.branchService.findAllByUserId(userId);
    }
    

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.branchService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
        return this.branchService.update(id, updateBranchDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.branchService.remove(id);
    }
}
