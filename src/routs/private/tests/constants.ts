import { guid } from '../../../common/functions/guid';

export const CREATE_ORDER_BODY_DATA = {
  topic: guid('topic'),
  minNumberPages: 10,
  maxNumberPages: 100,
  warrantyDays: 45,
  deadline: '2024-03-25T12:57:26.000Z',
  discription: guid('discription'),
  price: 10000,
};
