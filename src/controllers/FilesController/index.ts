import { File, Order, User } from '../../database/models';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FILE_ATTRIBUTES } from './constants';
import { FileAttributes } from '../../database/models/file';

export class FilesController {
  create = async (file: FileAttributes) => {
    const newFile = await File.create(file);
    return this.getInfo(newFile.id);
  };

  getInfo = async (id: number) => {
    const file = await File.findOne({
      where: {
        id,
      },
      include: [
        { model: User, as: 'user',  attributes: ['id', 'email'] },
        {
          model: Order,
          as: 'order',
        },
      ],
    });
    return file?.toJSON();
  };

  get = async (id: number) => {
    const file = await File.findOne({
      where: {
        id,
      },
      include: [
        { model: User, as: 'user',  attributes: ['id', 'email'] },
        {
          model: Order,
          as: 'order',
        },
      ],
    });
    if (file) {
      const model = file.toJSON();
      const fileName = model.filename;
      const path = join('/uploads', fileName);
      const result = readFileSync(process.cwd() + path);
      return { model, raw: result };
    }
    return null;
  };

  getByOrderId = async (orderId: number) => {
    const files = await File.findAll({
      where: {
        orderId,
      },
    });
    return files.map((item) => item.toJSON());
  };

  updateOrderId = async (id: number, orderId: number) => {
    await File.update({ orderId }, { where: { id } });
  };
}
