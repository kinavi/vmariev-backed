import { FoodAttributes } from '../../database/models/food';
import { Food, FoodUser } from '../../database/models';

export class FoodsController {
  get = async (id: number) => {
    const result = await Food.findOne({
      where: {
        id,
      },
      attributes: [
        'id',
        'title',
        'proteins',
        'fats',
        'carbohydrates',
        'description',
      ],
    });
    return result?.toJSON() || null;
  };

  getByUser = async (userId: number) => {
    const result = await FoodUser.findAll({
      where: {
        userId,
      },
    });
    const foods = await Promise.all(
      result.map((item) => this.get(item.foodId))
    );
    return foods.filter((item) => !!item);
  };

  create = async (data: FoodAttributes, userId: number) => {
    const { carbohydrates, fats, proteins, title, description } = data;
    const result = await Food.create({
      title,
      proteins,
      fats,
      carbohydrates,
      description,
    });
    await FoodUser.create({
      foodId: result.id,
      userId,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Pick<
      FoodAttributes,
      'title' | 'proteins' | 'fats' | 'carbohydrates' | 'description'
    >
  ) => {
    const [affectedCount] = await Food.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.get(id);
    }
    return null;
  };

  remove = async (id: number) => {
    const result = await Food.destroy({ where: { id } });
    return !!result;
  };
}
