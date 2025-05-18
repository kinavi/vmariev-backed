import { DataTypes, ForeignKey, Model } from 'sequelize';
import User from './user';
import connection from '../connection';

export interface TransactionCategoryAttributes {
  id: number;
  userId: number;
  title: string;
  color: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateTransactionCategoryAttributes {
  userId: number;
  title: string;
  color: string;
}

class TransactionCategory extends Model<
  TransactionCategoryAttributes,
  CreateTransactionCategoryAttributes
> {
  declare id: number;
  declare title: string;
  declare color: string;
  declare updatedAt: Date;
  declare createdAt: Date;

  declare userId: ForeignKey<User['id']>;
}

TransactionCategory.init(
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
    },
    title: DataTypes.STRING,
    color: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'TransactionCategories',
    sequelize: connection,
    modelName: 'TransactionCategory',
  }
);

export default TransactionCategory;
