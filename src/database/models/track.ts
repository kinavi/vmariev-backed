import { DataTypes, Model } from 'sequelize';
import connection from '../connection';

export interface TrackAttributes {
  id?: number;
  dateStart: Date;
  dateStop?: Date;
  taskId: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Track extends Model<TrackAttributes> implements TrackAttributes {
  public id!: number;
  public dateStart!: Date;
  public dateStop!: Date;
  public taskId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Track.init(
  {
    dateStart: DataTypes.DATE,
    dateStop: DataTypes.DATE,
    taskId: DataTypes.NUMBER,
  },
  {
    sequelize: connection,
    modelName: 'Track',
  }
);

export default Track;
