import { Module } from '@nestjs/common';
import { UserBranchService } from './user-branch.service';
import { UserBranchController } from './user-branch.controller';

@Module({
  controllers: [UserBranchController],
  providers: [UserBranchService],
})
export class UserBranchModule {}
