import { DataTypes, Model } from 'sequelize';
import connection from '../connection';

export interface DishFoodsAttributes {
  id?: number;
  dishId: number;
  foodId: number;
  weight: number;
  createdAt?: Date;
}

class DishFoods
  extends Model<DishFoodsAttributes>
  implements DishFoodsAttributes
{
  public id!: number;
  public dishId!: number;
  public foodId!: number;
  public weight!: number;
  public readonly createdAt!: Date;
}

DishFoods.init(
  {
    dishId: DataTypes.INTEGER,
    foodId: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
  },
  {
    sequelize: connection,
    modelName: 'DishFoods',
  }
);

export default DishFoods;
