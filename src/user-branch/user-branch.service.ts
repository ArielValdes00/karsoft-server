import { Injectable } from '@nestjs/common';
import { CreateUserBranchDto } from './dto/create-user-branch.dto';
import { UpdateUserBranchDto } from './dto/update-user-branch.dto';

@Injectable()
export class UserBranchService {
  create(createUserBranchDto: CreateUserBranchDto) {
    return 'This action adds a new userBranch';
  }

  findAll() {
    return `This action returns all userBranch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBranch`;
  }

  update(id: number, updateUserBranchDto: UpdateUserBranchDto) {
    return `This action updates a #${id} userBranch`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBranch`;
  }
}
