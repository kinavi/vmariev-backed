import { UserActivityEntries, User } from '../../database/models';
import { UserActivityEntryAttributes } from '../../database/models/userActivityEntries';
import { Op } from 'sequelize';

export class UserActivityEntriesController {
  get = async (id: number) => {
    const result = await UserActivityEntries.findOne({
      where: {
        id,
      },
      attributes: ['id', 'name', 'calories', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
    });
    return result?.toJSON();
  };

  getByDate = async (userId: number, date: Date) => {
    const dateStart = new Date(date);
    dateStart.setUTCHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setUTCHours(23, 59, 59, 999);
    const result = await UserActivityEntries.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: dateStart,
          [Op.lt]: dateEnd,
        },
      },
      attributes: ['id', 'name', 'calories', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
    });
    return result.map((item) => item.toJSON());
  };

  create = async (data: UserActivityEntryAttributes) => {
    const { calories, name, userId } = data;
    const result = await UserActivityEntries.create({
      calories,
      name,
      userId,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Omit<
      UserActivityEntryAttributes,
      'userId' | 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >
  ) => {
    await UserActivityEntries.update(data, { where: { id } });
    return this.get(id);
  };

  remove = async (id: number) => {
    const result = await UserActivityEntries.destroy({ where: { id } });
    return !!result;
  };
}
