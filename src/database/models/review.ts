import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface IReviewAttributes {
  id?: number;
  text: string;
  userId: number | null;
  login: string;
  isActive: boolean;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Review extends Model<IReviewAttributes> implements IReviewAttributes {
  public id!: number;
  public text!: string;
  public userId!: number | null;
  public login!: string;
  public isActive!: boolean;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Review.init(
  {
    text: DataTypes.STRING,
    userId: DataTypes.NUMBER,
    login: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection,
    modelName: 'Review',
  }
);

export default Review;
