import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

export interface FileAttributes {
  id?: number;
  fieldname: string;
  originalname: string;
  encoding: string;
  destination: string;
  filename: string;
  mimetype: string;
  path: string;
  size: number;
  userId: number;
  orderId: number;
  isPublic: boolean;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class File extends Model<FileAttributes> implements FileAttributes {
  public id!: number;
  public fieldname!: string;
  public originalname!: string;
  public encoding!: string;
  public mimetype!: string;
  public destination!: string;
  public filename!: string;
  public path!: string;
  public size!: number;
  public userId!: number;
  public orderId!: number;
  public isPublic!: boolean;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

File.init(
  {
    fieldname: DataTypes.STRING,
    originalname: DataTypes.STRING,
    encoding: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    destination: DataTypes.STRING,
    filename: DataTypes.STRING,
    path: DataTypes.STRING,
    size: DataTypes.NUMBER,
    userId: DataTypes.NUMBER,
    orderId: DataTypes.NUMBER,
    isPublic: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection,
    modelName: 'File',
  }
);

export default File;
