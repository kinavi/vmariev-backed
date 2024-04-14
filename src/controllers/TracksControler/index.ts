import Track, { TrackAttributes } from '../../database/models/track';
import { ICreateTrackData } from './types';

export class TracksControler {
  get = async (id: number) => {
    const result = await Track.findOne({
      where: {
        id,
      },
    });
    return result?.toJSON();
  };

  getAll = async () => {
    const offer = await Track.findAll();
    return offer?.map((item) => item.toJSON());
  };

  create = async (data: ICreateTrackData) => {
    const { dateStart, taskId } = data;
    const result = await Track.create({
      dateStart,
      taskId,
    });
    return result.toJSON();
  };

  update = async (id: number, data: { dateStop: Date }) => {
    await Track.update(data, { where: { id } });
    return this.get(id);
  };

  remove = async (id: number) => {
    const result = await Track.destroy({ where: { id } });
    return !!result;
  };
}
