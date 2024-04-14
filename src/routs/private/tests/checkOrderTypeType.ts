export const checkOrderTypeType = <
  DataType extends {
    id: number;
    label: string;
    isActive: boolean;
  }
>(
  data: DataType,
  comparisonData: DataType
) => {
  expect(data).toHaveProperty('id');
  expect(typeof data.id).toStrictEqual('number');
  expect(data).toHaveProperty('label');
  expect(data.label).toStrictEqual(comparisonData.label);
  expect(data).toHaveProperty('isActive');
  expect(data.isActive).toStrictEqual(comparisonData.isActive);
};