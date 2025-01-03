import { Dish, DishFoods, Food, User } from '../../database/models';
import { DishStatus } from '../../database/models/dish';

export class DishesController {
  get = async (dishId: number) => {
    const result = await Dish.findOne({
      where: {
        id: dishId,
        isDeleted: false,
      },
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
    });
    return result?.toJSON();
  };

  getByUser = async (userId: number) => {
    const dishesByuser = await Dish.findAll({
      where: {
        userId,
      },
    });
    const result = await Promise.all(
      dishesByuser.map((item) => this.get(item.id))
    );
    return result.filter((item) => !!item);
  };

  create = async (data: {
    title: string;
    foods: { foodId: number; weight: number }[];
    userId: number;
  }) => {
    const { foods, title, userId } = data;
    const dish = await Dish.create({
      title,
      status: DishStatus.ACTIVE,
      isDeleted: false,
      userId,
    });
    try {
      await Promise.all(
        foods.map((item) => {
          return DishFoods.create({
            dishId: dish.id,
            foodId: item.foodId,
            weight: item.weight,
          });
        })
      );
      return this.get(dish.id);
    } catch (error) {
      this.remove(dish.id);
      throw error;
    }
  };

  update = async (
    id: number,
    data: {
      title: string;
      foods: { foodId: number; weight: number }[];
    }
  ) => {
    await this.removeFoodLinks(id);
    await Dish.update(
      {
        title: data.title,
      },
      {
        where: {
          id,
        },
      }
    );
    try {
      await Promise.all(
        data.foods.map((item) => {
          return DishFoods.create({
            dishId: id,
            foodId: item.foodId,
            weight: item.weight,
          });
        })
      );
      return this.get(id);
    } catch (error) {
      this.remove(id);
      throw error;
    }
  };

  removeFoodLinks = async (dishId: number) => {
    const result = await DishFoods.destroy({
      where: {
        dishId,
      },
    });
    return !!result;
  };

  remove = async (id: number) => {
    await this.removeFoodLinks(id);
    const result = await Dish.destroy({ where: { id } });
    return !!result;
  };
}
