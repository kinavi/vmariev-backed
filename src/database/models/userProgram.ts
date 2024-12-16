import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export enum SexType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ActivityType {
  LOW = 'LOW',
  LIGHT = 'LIGHT',
  MIDDLE = 'MIDDLE',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export enum GoalType {
  MASS_GAIN = 'MASS_GAIN',
  NORMAL = 'NORMAL',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
}

export interface UserProgramAttributes {
  id?: number;
  userId: number;
  sex: SexType;
  age: number;
  weight: number;
  height: number;
  physicalActivity: ActivityType;
  goal: GoalType;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  ratioCarbohydrates: number;
  ratioProteins: number;
  ratioFats: number;
  isExcludeActivity: boolean;
}

class UserProgram
  extends Model<UserProgramAttributes>
  implements UserProgramAttributes
{
  public id!: number;
  public userId!: number;
  public sex!: SexType;
  public age!: number;
  public weight!: number;
  public height!: number;
  public physicalActivity!: ActivityType;
  public goal!: GoalType;
  public ratioCarbohydrates!: number;
  public ratioProteins!: number;
  public ratioFats!: number;
  public isExcludeActivity!: boolean;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

UserProgram.init(
  {
    userId: DataTypes.INTEGER,
    sex: DataTypes.ENUM(SexType.MALE, SexType.FEMALE),
    age: DataTypes.INTEGER,
    goal: DataTypes.ENUM(
      GoalType.MASS_GAIN,
      GoalType.NORMAL,
      GoalType.WEIGHT_LOSS
    ),
    physicalActivity: DataTypes.ENUM(
      ActivityType.LOW,
      ActivityType.LIGHT,
      ActivityType.MIDDLE,
      ActivityType.HIGH,
      ActivityType.EXTREME
    ),
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    ratioCarbohydrates: DataTypes.INTEGER,
    ratioProteins: DataTypes.INTEGER,
    ratioFats: DataTypes.INTEGER,
    isExcludeActivity: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection,
    modelName: 'UserPrograms',
  }
);

export default UserProgram;
