import { DataTypes, ForeignKey, Model } from 'sequelize';
import User from './user';
import connection from '../connection';

export interface BaseCurrencyUserAttributes {
  id: number;
  userId: number;
  currencyCharCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBaseCurrencyUserAttributes {
  userId: number;
  currencyCharCode: string;
}

class BaseCurrencyUser extends Model<
  BaseCurrencyUserAttributes,
  CreateBaseCurrencyUserAttributes
> {
  declare id: number;
  declare currencyCharCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare userId: ForeignKey<User['id']>;
}

BaseCurrencyUser.init(
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
    currencyCharCode: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'BaseCurrencyUser',
  }
);

export default BaseCurrencyUser;
