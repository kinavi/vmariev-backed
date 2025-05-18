import { DataTypes, Model } from 'sequelize';
import connection from '../connection';

export interface CurrencyRubRateAttributes {
  id: number;
  charCode: string;
  nominal: number;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCurrencyRubRateAttributes {
  charCode: string;
  nominal: number;
  name: string;
  value: number;
}

class CurrencyRubRate extends Model<
  CurrencyRubRateAttributes,
  CreateCurrencyRubRateAttributes
> {
  declare id: number;
  declare charCode: string;
  declare nominal: number;
  declare name: string;
  declare value: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CurrencyRubRate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    charCode: DataTypes.STRING,
    name: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'CurrencyRubRate',
  }
);

export default CurrencyRubRate;
