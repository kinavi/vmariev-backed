import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface UserProgramMealEntryAttributes {
  id?: number;
  userProgramId: number;
  mealEntryId: number;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}
class UserProgramMealEntry
  extends Model<UserProgramMealEntryAttributes>
  implements UserProgramMealEntryAttributes
{
  public id!: number;
  public userProgramId!: number;
  public mealEntryId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

UserProgramMealEntry.init(
  {
    userProgramId: DataTypes.INTEGER,
    mealEntryId: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'UserProgramMealEntries',
  }
);

export default UserProgramMealEntry;
