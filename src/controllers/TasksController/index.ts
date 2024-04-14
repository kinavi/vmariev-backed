import { Task } from '../../database/models';
import { ICreateTaskData } from './types';

export class TasksController {
  get = async (id: number) => {
    const offer = await Task.findOne({
      where: {
        id,
      },
    });
    return offer?.toJSON();
  };

  getAll = async () => {
    const offer = await Task.findAll();
    return offer?.map((item) => item.toJSON());
  };

  create = async (data: ICreateTaskData) => {
    const { description, name, userId } = data;
    const result = await Task.create({
      name,
      userId,
      description,
    });
    return result.toJSON();
  };

  update = async (
    id: number,
    data: Pick<ICreateTaskData, 'name' | 'description'>
  ) => {
    await Task.update(data, { where: { id } });
    return this.get(id);
  };

  remove = async (id: number) => {
    const result = await Task.destroy({ where: { id } });
    return !!result;
  };
}
