import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export enum OrderTypeEnum {
  initial = 'initial',
  readyForWork = 'ready-for-work',
  process = 'process',
  warranty = 'warranty',
  rework = 'rework',
  done = 'done',
}

export interface IOrderAttributes {
  id?: number;
  topic: string;
  discription?: string;
  customerId: number;
  deadline?: Date;
  price?: number;
  status?: OrderTypeEnum;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Order extends Model<IOrderAttributes> implements IOrderAttributes {
  public id!: number;
  public topic!: string;
  public discription!: string;
  public customerId!: number;
  public deadline!: Date;
  public price!: number;
  public status!: OrderTypeEnum;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Order.init(
  {
    topic: DataTypes.STRING,
    discription: DataTypes.STRING,
    customerId: DataTypes.NUMBER,
    deadline: DataTypes.DATE,
    price: DataTypes.NUMBER,
    status: DataTypes.ENUM(
      'initial',
      'ready-for-work',
      'process',
      'warranty',
      'rework',
      'done'
    ),
  },
  {
    sequelize: connection,
    modelName: 'Order',
  }
);

export default Order;
