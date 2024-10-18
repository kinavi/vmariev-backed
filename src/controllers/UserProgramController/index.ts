import { UserProgramAttributes } from '../../database/models/userProgram';
import { Meal, User, UserProgram } from '../../database/models';

export class UserProgramController {
  get = async (id: number) => {
    const result = await UserProgram.findOne({
      where: {
        id,
      },
      attributes: ['id', 'age', 'goal', 'physicalActivity', 'sex'],
    });
    return result?.toJSON();
  };

  hasProgram = async (userId: number) => {
    const result = await UserProgram.findOne({
      where: {
        userId,
      },
      attributes: ['id', 'age', 'goal', 'physicalActivity', 'sex'],
    });
    return !!result;
  };

  create = async (data: UserProgramAttributes) => {
    const { userId, age, goal, physicalActivity, sex } = data;
    const result = await UserProgram.create({
      userId,
      age,
      goal,
      physicalActivity,
      sex,
    });
    return this.get(result.id);
  };

  update = async (
    id: number,
    data: Pick<
      UserProgramAttributes,
      'age' | 'goal' | 'physicalActivity' | 'sex'
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
