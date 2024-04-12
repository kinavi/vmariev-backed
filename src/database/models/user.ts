import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface IUserAttributes {
  id?: number;
  email: string;
  salt: string;
  hash: string;
  login: string;
  phone: string;
  role: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class User extends Model<IUserAttributes> implements IUserAttributes {
  public id!: number;
  public email!: string;
  public salt!: string;
  public hash!: string;
  public login!: string;
  public phone!: string;
  public role!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

User.init(
  {
    email: DataTypes.STRING,
    salt: DataTypes.STRING,
    hash: DataTypes.STRING,
    login: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.ENUM('executor', 'client', 'owner'),
  },
  {
    sequelize: connection,
    modelName: 'User',
  }
);

export default User;
