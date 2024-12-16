import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface MealAttributes {
  id?: number;
  foodId: number;
  weight: number;
  userId: number;
  userProgramId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class MealEntry extends Model<MealAttributes> implements MealAttributes {
  public id!: number;
  public foodId!: number;
  public weight!: number;
  public userId!: number;
  public userProgramId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

MealEntry.init(
  {
    foodId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    userProgramId: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'MealEntry',
  }
);

export default MealEntry;
