import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface FoodUserAttributes {
  id?: number;
  foodId: number;
  userId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class FoodUser extends Model<FoodUserAttributes> implements FoodUserAttributes {
  public id!: number;
  public foodId!: number;
  public userId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

FoodUser.init(
  {
    foodId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'FoodUsers',
  }
);

export default FoodUser;
