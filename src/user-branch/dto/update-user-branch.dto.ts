import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBranchDto } from './create-user-branch.dto';

export class UpdateUserBranchDto extends PartialType(CreateUserBranchDto) {}
