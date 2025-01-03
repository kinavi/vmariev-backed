import { Model, DataTypes, Sequelize } from 'sequelize';
import connection from '../connection';

export enum MealEntryType {
  food = 'food',
  dish = 'dish',
}

export interface MealAttributes {
  id?: number;
  entryId: number;
  weight: number;
  userId: number;
  userProgramId: number;
  entryType: MealEntryType;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class MealEntry extends Model<MealAttributes> implements MealAttributes {
  public id!: number;
  public entryId!: number;
  public weight!: number;
  public userId!: number;
  public userProgramId!: number;
  public entryType!: MealEntryType;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

MealEntry.init(
  {
    entryId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    userProgramId: DataTypes.INTEGER,
    entryType: DataTypes.ENUM(MealEntryType.dish, MealEntryType.dish),
  },
  {
    sequelize: connection,
    modelName: 'MealEntry',
  }
);

export default MealEntry;
