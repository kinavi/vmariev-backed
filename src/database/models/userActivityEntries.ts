import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface UserActivityEntryAttributes {
  id?: number;
  userId: number;
  name: string;
  calories: number;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class UserActivityEntry
  extends Model<UserActivityEntryAttributes>
  implements UserActivityEntryAttributes
{
  public id!: number;
  public userId!: number;
  public name!: string;
  public calories!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

UserActivityEntry.init(
  {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    calories: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'UserActivityEntries',
  }
);

export default UserActivityEntry;
