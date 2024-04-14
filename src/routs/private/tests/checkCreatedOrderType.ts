import { CREATE_ORDER_BODY_DATA } from './constants';
import { getObjectKeys } from '../../../common/functions/getObjectKeys';
import compareDesc from 'date-fns/compareDesc';

export const checkCreatedOrderType = <
  DataType extends typeof CREATE_ORDER_BODY_DATA & { id: number }
>(
  data: DataType,
  comparisonData: DataType
) => {
  expect(data).toHaveProperty('id');
  expect(typeof data.id).toStrictEqual('number');
  const keys = getObjectKeys(comparisonData);
  keys.map((item) => {
    expect(data).toHaveProperty(item as any);
    expect(data[item]).toStrictEqual(comparisonData[item]);
  });
};
