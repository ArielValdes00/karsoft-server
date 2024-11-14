import { Column, DataType, ForeignKey, Table, Model } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Branch } from 'src/branch/entities/branch.entity'; 

@Table({ tableName: 'user_branches' })
export class UserBranch extends Model<UserBranch> {
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID })
    userId: string;

    @ForeignKey(() => Branch)
    @Column({ type: DataType.UUID })
    branchId: string;
}
