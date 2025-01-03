import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export enum DishStatus {
  ACTIVE = 'ACTIVE',
  CLOSE = 'CLOSE',
}

export interface DishAttributes {
  id?: number;
  title: string;
  status: DishStatus;
  createdAt?: Date;
  isDeleted: boolean;
  userId: number;
}

class Dish extends Model<DishAttributes> implements DishAttributes {
  public id!: number;
  public title!: string;
  public status!: DishStatus;
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public userId!: number;
}

Dish.init(
  {
    title: DataTypes.STRING,
    status: DataTypes.ENUM('ACTIVE', 'CLOSE'),
    isDeleted: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'Dishes',
  }
);

export default Dish;
