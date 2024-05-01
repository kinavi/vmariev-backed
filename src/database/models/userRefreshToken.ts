import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface IUserRefreshTokenAttributes {
  id?: number;
  userId: number;
  refreshToken: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class UserRefreshToken
  extends Model<IUserRefreshTokenAttributes>
  implements IUserRefreshTokenAttributes
{
  public id!: number;
  public userId!: number;
  public refreshToken!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

UserRefreshToken.init(
  {
    userId: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'UserRefreshTokens',
  }
);

export default UserRefreshToken;
