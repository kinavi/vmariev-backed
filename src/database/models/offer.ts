import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface OfferAttributes {
  id?: number;
  email: string;
  phone: string;
  code: number;
  isConfirm: boolean;
  lifeDate: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Offer extends Model<OfferAttributes> implements OfferAttributes {
  public id!: number;
  public email!: string;
  public phone!: string;
  public code!: number;
  public isConfirm!: boolean;
  public lifeDate!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Offer.init(
  {
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    code: DataTypes.NUMBER,
    isConfirm: DataTypes.BOOLEAN,
    lifeDate: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: 'Offer',
  }
);

export default Offer;
