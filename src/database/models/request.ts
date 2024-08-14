import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface IRequestAttributes {
  id?: number;
  name: string;
  email: string;
  servise: string;
  description: string;
  budget: string;
  deadline: string;
  clientIp: string;
}

class Request
  extends Model<IRequestAttributes & { updatedAt: string; createdAt: string }>
  implements IRequestAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public servise!: string;
  public description!: string;
  public budget!: string;
  public deadline!: string;
  public clientIp!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Request.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    servise: DataTypes.STRING,
    description: DataTypes.STRING,
    budget: DataTypes.STRING,
    deadline: DataTypes.STRING,
    clientIp: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'Request',
  }
);

export default Request;
