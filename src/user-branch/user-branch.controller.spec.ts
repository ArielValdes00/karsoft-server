import { Test, TestingModule } from '@nestjs/testing';
import { UserBranchController } from './user-branch.controller';
import { UserBranchService } from './user-branch.service';

describe('UserBranchController', () => {
  let controller: UserBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBranchController],
      providers: [UserBranchService],
    }).compile();

    controller = module.get<UserBranchController>(UserBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
