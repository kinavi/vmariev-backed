import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

interface MealTimerAttributes {
  id?: number;
  title: string;
  interval: number;
  lastMealDate: Date;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class MealTimer
  extends Model<MealTimerAttributes>
  implements MealTimerAttributes
{
  public id!: number;
  public title!: string;
  public interval!: number;
  public lastMealDate!: Date;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

MealTimer.init(
  {
    title: DataTypes.STRING,
    interval: DataTypes.INTEGER,
    lastMealDate: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'MealTimers',
  }
);

export default MealTimer;
