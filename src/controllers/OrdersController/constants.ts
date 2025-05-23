import User from '../../database/models/user';
import File from '../../database/models/file';

export const ORDER_ATTRIBUTES = [
  'id',
  'topic',
  'minNumberPages',
  'maxNumberPages',
  'warrantyDays',
  'discription',
  'files',
  'status',
  'deadline',
  'price',
  'createdAt',
];

export const ORDER_INCLUDE_DATA = [
  {
    model: User,
    as: 'customer',
    attributes: ['id', 'email']
  },
  {
    model: User,
    as: 'executor',
    attributes: ['id', 'email']
  },
  {
    model: File,
    as: 'files',
  },
];
