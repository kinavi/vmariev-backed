import { DataTypes, ForeignKey, Model } from 'sequelize';
import CoinTransaction, { CoinTransactionType } from './coinTransaction';
import User from './user';
import TransactionCategory from './transactionCategory';
import connection from '../connection';

export enum CoinPlannedTransactionStatusType {
  pending = 'pending',
  completed = 'completed',
  skipped = 'skipped',
}

export interface CoinPlannedTransactionAttributes {
  id: number;
  userId: number;
  categoryId?: number;
  title: string;
  description?: string;
  amount: number;
  type: CoinTransactionType;
  plannedDate?: Date;
  currencyCharCode: string;

  actualTransactionId?: number;
  status: CoinPlannedTransactionStatusType;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCoinPlannedTransactionAttributes {
  userId: number;
  categoryId?: number;
  title: string;
  description?: string;
  amount: number;
  type: CoinTransactionType;
  plannedDate?: Date;
  currencyCharCode: string;

  actualTransactionId?: number;
  status: CoinPlannedTransactionStatusType;
}

class CoinPlannedTransaction extends Model<
  CoinPlannedTransactionAttributes,
  CreateCoinPlannedTransactionAttributes
> {
  declare id: number;

  declare userId: ForeignKey<User['id']>;
  declare categoryId?: ForeignKey<TransactionCategory['id']>;
  declare actualTransactionId?: ForeignKey<CoinTransaction['id']>;

  declare title: string;
  declare description?: string;
  declare amount: number;
  declare type: CoinTransactionType;
  declare plannedDate?: Date;
  declare status: CoinPlannedTransactionStatusType;
  declare currencyCharCode: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

CoinPlannedTransaction.init(
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
    title: DataTypes.STRING,
    description: { type: DataTypes.STRING, allowNull: true },
    amount: DataTypes.INTEGER,
    plannedDate: { type: DataTypes.DATE, allowNull: true },
    actualTransactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: CoinTransaction,
        key: 'id',
      },
      allowNull: true,
    },
    currencyCharCode: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(
        CoinPlannedTransactionStatusType.completed,
        CoinPlannedTransactionStatusType.pending,
        CoinPlannedTransactionStatusType.skipped
      ),
      allowNull: false,
      defaultValue: CoinPlannedTransactionStatusType.pending,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'CoinPlannedTransaction',
    tableName: 'CoinPlannedTransactions',
  }
);

export default CoinPlannedTransaction;
