import { MealAttributes } from '../../database/models/mealEntrie';
import { Meal, Food, User, UserProgram } from '../../database/models';
import { Op } from 'sequelize';

export class MealEntriesController {
  get = async (id: number) => {
    const result = await Meal.findOne({
      where: {
        id,
      },
      attributes: ['id', 'weight', 'createdAt'],
      include: [
        {
          model: Food,
          as: 'food',
        },
        {
          model: User,
          as: 'user',
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
      attributes: ['id', 'weight', 'createdAt'],
      include: [
        {
          model: Food,
          as: 'food',
        },
        {
          model: User,
          as: 'user',
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
    const { foodId, weight, userId, userProgramId } = data;
    const result = await Meal.create({
      foodId,
      weight,
      userId,
      userProgramId,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Pick<MealAttributes, 'weight' | 'foodId'>
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
