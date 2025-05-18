import { BaseCurrencyUser, User } from '../../database/models';
import { CreateBaseCurrencyUserAttributes } from '../../database/models/baseCurrencyUser';

export class BaseCurrencyUserController {
  get = async (userId: number) => {
    const result = await BaseCurrencyUser.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    return result?.toJSON();
  };

  create = async (data: CreateBaseCurrencyUserAttributes) => {
    const result = await BaseCurrencyUser.create(data);
    return result;
  };

  update = async (currencyCharCode: string, userId: number) => {
    await BaseCurrencyUser.update(
      {
        currencyCharCode,
      },
      {
        where: {
          userId,
        },
      }
    );
    return this.get(userId);
  };

  remove = async (userId: number) => {
    const result = await BaseCurrencyUser.destroy({
      where: {
        userId,
      },
    });
    return result > 0;
  };
}
