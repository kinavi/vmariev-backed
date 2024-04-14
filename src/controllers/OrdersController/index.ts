import { Op } from 'sequelize';
import { IOrderAttributes, OrderTypeEnum } from '../../database/models/order';
import { Order, File, User } from '../../database/models';
import { ORDER_INCLUDE_DATA } from './constants';

function removeUndefinedProps(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}
export class OrdersController {
  get = async (id: number) => {
    const result = await Order.findOne({
      where: {
        id,
      },
      include: ORDER_INCLUDE_DATA,
    });
    return result?.toJSON();
  };

  getByCustomerId = async (customerId: number) => {
    const result = await Order.findAll({
      where: {
        customerId,
      },
      include: ORDER_INCLUDE_DATA,
    });
    return result.map((item) => item.toJSON());
  };

  getAll = async () => {
    const orders = await Order.findAll({
      include: ORDER_INCLUDE_DATA,
    });
    return orders.map((item) => item.toJSON());
  };

  getByStatus = async (params: {
    status: OrderTypeEnum;
    userId: number;
    subjectId?: number;
    typeId?: number;
  }) => {
    const { userId, ...searchParams } = params;
    const result = await Order.findAll({
      where: removeUndefinedProps(searchParams),
      include: [
        {
          model: User,
          as: 'customer',
        },
        {
          model: File,
          as: 'files',
        },
      ],
    });
    return result.map((item) => item.toJSON());
  };

  create = async (data: IOrderAttributes) => {
    const result = await Order.create(data);
    return this.get(result.id);
  };

  getByUserBets = async (userId: string) => {
    const order = await Order.findAll({
      include: [
        {
          model: User,
          as: 'customer',
        },
        {
          model: User,
          as: 'executor',
          attributes: ['id', 'login'],
        },
      ],
    });
    return order.map((item) => item.toJSON());
  };

  remove = async (id: number) => {
    const result = await Order.destroy({ where: { id } });
    return !!result;
  };
}
