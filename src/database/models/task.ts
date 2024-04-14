import { DataTypes, Model } from 'sequelize';
import connection from '../connection';

export interface TaskAttributes {
  id?: number;
  name: string;
  description: string;
  userId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public userId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Task.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.NUMBER,
  },
  {
    sequelize: connection,
    modelName: 'Task',
  }
);

export default Task;
