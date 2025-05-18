import { DataTypes, ForeignKey, Model } from 'sequelize';
import User from './user';
import TransactionCategory from './transactionCategory';
import connection from '../connection';

export enum CoinTransactionType {
  income = 'income',
  expense = 'expense',
  transfer = 'transfer',
}

export interface CoinTransactionAttributes {
  id: number;
  userId: number;
  categoryId?: number;
  title: string;
  description?: string;
  amount: number;
  type: CoinTransactionType;
  currencyCharCode: string;

  date: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCoinTransactionAttributes {
  userId: number;
  categoryId?: number;
  title: string;
  description?: string;
  amount: number;
  type: CoinTransactionType;
  currencyCharCode: string;
  date: Date;
}

class CoinTransaction extends Model<
  CoinTransactionAttributes,
  CreateCoinTransactionAttributes
> {
  declare id: number;

  declare userId: ForeignKey<User['id']>;
  declare categoryId?: ForeignKey<TransactionCategory['id']>;

  declare title: string;
  declare description?: string;
  declare amount: number;
  declare type: CoinTransactionType;

  declare date: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare currencyCharCode: string;
}

CoinTransaction.init(
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
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: TransactionCategory,
        key: 'id',
      },
      allowNull: true,
    },
    type: DataTypes.ENUM(
      CoinTransactionType.expense,
      CoinTransactionType.income,
      CoinTransactionType.transfer
    ),
    currencyCharCode: DataTypes.STRING,
    title: DataTypes.STRING,
    description: { type: DataTypes.STRING, allowNull: true },
    amount: DataTypes.DECIMAL(10, 2),
    date: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'CoinTransaction',
    tableName: 'CoinTransactions',
  }
);

export default CoinTransaction;
