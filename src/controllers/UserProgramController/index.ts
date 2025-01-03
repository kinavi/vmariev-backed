import { UserProgramAttributes } from '../../database/models/userProgram';
import { Meal, User, UserProgram } from '../../database/models';

export class UserProgramController {
  get = async (id: number) => {
    const result = await UserProgram.findOne({
      where: {
        id,
      },
      attributes: [
        'id',
        'age',
        'goal',
        'physicalActivity',
        'sex',
        'height',
        'weight',
        'ratioCarbohydrates',
        'ratioProteins',
        'ratioFats',
        'isExcludeActivity',
      ],
    });
    return result?.toJSON();
  };

  getByUserId = async (userId: number) => {
    const result = await UserProgram.findOne({
      where: {
        userId,
      },
      attributes: [
        'id',
        'age',
        'goal',
        'physicalActivity',
        'sex',
        'height',
        'weight',
        'ratioCarbohydrates',
        'ratioProteins',
        'ratioFats',
        'isExcludeActivity',
      ],
      order: [['createdAt', 'DESC']], // Сортируем по дате создания в порядке убывания
    });
    return result?.toJSON();
  };

  hasProgram = async (userId: number) => {
    const result = await UserProgram.findOne({
      where: {
        userId,
      },
      attributes: [
        'id',
        'age',
        'goal',
        'physicalActivity',
        'sex',
        'height',
        'weight',
        'ratioCarbohydrates',
        'ratioProteins',
        'ratioFats',
        'isExcludeActivity',
      ],
    });
    return !!result;
  };

  create = async (data: UserProgramAttributes) => {
    const {
      userId,
      age,
      goal,
      physicalActivity,
      sex,
      height,
      weight,
      ratioCarbohydrates,
      ratioFats,
      ratioProteins,
      isExcludeActivity,
    } = data;
    const result = await UserProgram.create({
      userId,
      age,
      goal,
      physicalActivity,
      sex,
      height,
      weight,
      ratioCarbohydrates,
      ratioFats,
      ratioProteins,
      isExcludeActivity,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Pick<
      UserProgramAttributes,
      | 'age'
      | 'goal'
      | 'physicalActivity'
      | 'sex'
      | 'height'
      | 'weight'
      | 'isExcludeActivity'
    >
  ) => {
    const [affectedCount] = await UserProgram.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.get(id);
    }
    return null;
  };

  remove = async (id: number) => {
    const result = await UserProgram.destroy({ where: { id } });
    return !!result;
  };
}
