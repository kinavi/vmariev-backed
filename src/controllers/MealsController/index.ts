import { MealAttributes } from '../../database/models/mealEntrie';
import { Meal, Food, User, UserProgram, Dish } from '../../database/models';
import { Op } from 'sequelize';

export class MealEntriesController {
  get = async (id: number) => {
    const result = await Meal.findOne({
      where: {
        id,
      },
      attributes: ['id', 'weight', 'createdAt', 'entryType'],
      include: [
        { model: Food, as: 'food' },
        {
          model: Dish,
          as: 'dish',
          attributes: ['id', 'title', 'status', 'createdAt'],
          include: [
            {
              model: Food,
              as: 'foods',
              through: {
                attributes: ['weight'],
                as: 'dishInfo',
              },
              attributes: ['id', 'title', 'proteins', 'fats', 'carbohydrates'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
        {
          model: UserProgram,
          as: 'userProgram',
        },
      ],
    });
    return result?.toJSON();
  };

  getByTargerDate = async (userId: number, targetDate: Date) => {
    const dateStart = new Date(targetDate);
    dateStart.setUTCHours(0, 0, 0, 0);
    const dateEnd = new Date(targetDate);
    dateEnd.setUTCHours(23, 59, 59, 999);
    const result = await Meal.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: dateStart,
          [Op.lt]: dateEnd,
        },
      },
      attributes: ['id', 'weight', 'createdAt', 'entryType'],
      include: [
        { model: Food, as: 'food' },
        {
          model: Dish,
          as: 'dish',
          attributes: ['id', 'title', 'status', 'createdAt'],
          include: [
            {
              model: Food,
              as: 'foods',
              through: {
                attributes: ['weight'],
                as: 'dishInfo',
              },
              attributes: ['id', 'title', 'proteins', 'fats', 'carbohydrates'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
        {
          model: UserProgram,
          as: 'userProgram',
        },
      ],
    });
    return result.map((item) => item.toJSON());
  };

  create = async (data: MealAttributes) => {
    const { weight, userId, userProgramId, entryId, entryType } = data;
    const result = await Meal.create({
      entryId,
      weight,
      userId,
      userProgramId,
      entryType,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Pick<MealAttributes, 'weight' | 'entryId' | 'entryType'>
  ) => {
    const [affectedCount] = await Meal.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.get(id);
    }
    return null;
  };

  remove = async (id: number) => {
    const result = await Meal.destroy({ where: { id } });
    return !!result;
  };
}
