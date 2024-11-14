import { Test, TestingModule } from '@nestjs/testing';
import { UserBranchService } from './user-branch.service';

describe('UserBranchService', () => {
  let service: UserBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBranchService],
    }).compile();

    service = module.get<UserBranchService>(UserBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
