import { MealAttributes } from '../../database/models/meal';
import { Meal, Food, User } from '../../database/models';

export class MealsController {
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

  getByUserId = async (id: number) => {
    const result = await Meal.findAll({
      where: {
        userId: id,
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
    return result.map((item) => item.toJSON());
  };

  create = async (data: MealAttributes) => {
    const { foodId, weight, userId } = data;
    const result = await Meal.create({
      foodId,
      weight,
      userId,
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
