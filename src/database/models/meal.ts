import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface MealAttributes {
  id?: number;
  foodId: number;
  weight: number;
  userId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Meal extends Model<MealAttributes> implements MealAttributes {
  public id!: number;
  public foodId!: number;
  public weight!: number;
  public userId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Meal.init(
  {
    foodId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'Meals',
  }
);

export default Meal;
