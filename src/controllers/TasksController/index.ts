import { Sequelize } from 'sequelize';
import { Task, Track } from '../../database/models';
import { ICreateTaskData } from './types';
import { TaskAttributes } from '../../database/models/task';
import { TrackAttributes } from '../../database/models/track';

export class TasksController {
  get = async (
    id: number
  ): Promise<(TaskAttributes & { tracks: TrackAttributes[] }) | null> => {
    const result = await Task.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Track,
          as: 'tracks',
        },
      ],
    });
    return (
      (result?.toJSON() as TaskAttributes & { tracks: TrackAttributes[] }) ||
      null
    );
  };

  getAll = async (): Promise<
    (TaskAttributes & { tracks: TrackAttributes[] })[]
  > => {
    const result = await Task.findAll({
      include: [
        {
          model: Track,
          as: 'tracks',
          // required: false,
          // where: {
          //   dateStop: null,
          // },
          // attributes: [
          //   'id',
          //   'dateStop',
          //   'dateStart',
          //   'limit',
          //   'taskId',
          //   [
          //     Sequelize.fn(
          //       'DATEDIFF',
          //       Sequelize.col('dateStop'),
          //       Sequelize.col('dateStart')
          //     ),
          //     'deltaTime',
          //   ],
          // ],
        },
      ],
    });
    return result?.map((item) => item.toJSON()) || [];
  };

  getAllRunning = async (userId: number) => {
    const result = await Task.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Track,
          as: 'tracks',
          where: {
            dateStop: null,
          },
        },
      ],
    });
    return result.map((item) => item.toJSON());
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
    const tracks = await Track.findAll({ where: { taskId: id } });
    const result = await Task.destroy({ where: { id } });
    tracks.map((track) => Track.destroy({ where: { id: track.id } }));
    return !!result;
  };
}
