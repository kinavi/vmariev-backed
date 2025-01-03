import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export interface FoodAttributes {
  id?: number;
  title: string;
  proteins: number;
  fats: number;
  carbohydrates: number;
  description?: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Food extends Model<FoodAttributes> implements FoodAttributes {
  public id!: number;
  public title!: string;
  public proteins!: number;
  public fats!: number;
  public carbohydrates!: number;
  public description!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Food.init(
  {
    title: DataTypes.STRING,
    proteins: DataTypes.FLOAT,
    fats: DataTypes.FLOAT,
    carbohydrates: DataTypes.FLOAT,
    description: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'Foods',
  }
);

export default Food;
