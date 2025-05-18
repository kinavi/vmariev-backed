import { DataTypes, ForeignKey, Model } from 'sequelize';
import User from './user';
import connection from '../connection';

export interface UserPlannedBalanceAttributes {
  id: number;
  userId: number;
  currency: string;
  amount: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateUserPlannedBalanceAttributes {
  userId: number;
  currency: string;
  amount: number;
}

class UserPlannedBalance extends Model<
  UserPlannedBalanceAttributes,
  CreateUserPlannedBalanceAttributes
> {
  declare id: number;
  declare userId: ForeignKey<User['id']>;
  declare currency: string;
  declare amount: number;
  declare updatedAt: Date;
  declare createdAt: Date;
}

UserPlannedBalance.init(
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
    tableName: 'UserPlannedBalances',
    sequelize: connection,
    modelName: 'UserPlannedBalance',
  }
);

export default UserPlannedBalance;
