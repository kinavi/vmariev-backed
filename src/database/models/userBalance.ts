import { DataTypes, ForeignKey, Model } from 'sequelize';
import User from './user';
import connection from '../connection';

export interface UserBalanceAttributes {
  id: number;
  userId: number;
  currency: string;
  amount: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateUserBalanceAttributes {
  userId: number;
  currency: string;
  amount: number;
}

class UserBalance extends Model<
  UserBalanceAttributes,
  CreateUserBalanceAttributes
> {
  declare id: number;
  declare userId: ForeignKey<User['id']>;
  declare currency: string;
  declare amount: number;
  declare updatedAt: Date;
  declare createdAt: Date;
}

UserBalance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      unique: true,
    },
    currency: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'UserBalances',
    sequelize: connection,
    modelName: 'UserBalance',
  }
);

export default UserBalance;
