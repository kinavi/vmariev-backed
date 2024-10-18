import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface UserProgramAttributes {
  id?: number;
  userId: number;
  sex: string;
  age: number;
  physicalActivity: number;
  goal: number;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class UserProgram
  extends Model<UserProgramAttributes>
  implements UserProgramAttributes
{
  public id!: number;
  public userId!: number;
  public sex!: string;
  public age!: number;
  public physicalActivity!: number;
  public goal!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

UserProgram.init(
  {
    userId: DataTypes.INTEGER,
    sex: DataTypes.STRING,
    age: DataTypes.INTEGER,
    goal: DataTypes.INTEGER,
    physicalActivity: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'UserPrograms',
  }
);

export default UserProgram;
