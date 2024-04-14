import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';
import { ICreateUserData, ITokenData } from './types';

export class UsersController {
  create = async (data: ICreateUserData) => {
    const { email, password, phone, login, role } = data;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 100, 'sha512')
      .toString('hex');
    const result = await User.create({
      email,
      hash,
      login,
      phone,
      role,
      salt,
    });
    return this.get(result.id);
  };

  get = async (id: number) => {
    const user = await User.findOne({
      where: { id },
    });
    return user?.toJSON();
  };

  getUserByEmail = async (email: string) => {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user?.toJSON();
  };

  createToken = async (email: string, password: string) => {
    if (!process.env.JWT_SECRET) {
      throw 'no has JWT_SECRET';
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw {
        status: 'error',
        field: 'email',
        message: 'Пользователь не найден',
      };
    }

    if (!this.checkUser(user, password)) {
      throw {
        status: 'error',
        field: 'password',
        message: 'Не верный пароль',
      };
    }

    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const token = jwt.sign(
      {
        email,
        password,
        id: user.id,
        exp: parseInt(String(expirationDate.getTime() / 1000), 10),
      },
      process.env.JWT_SECRET
    );
    return {
      token,
      user: user.toJSON(),
    };
  };

  checkToken = async (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw 'no has JWT_SECRET';
    }

    const data = (await jwt.verify(
      token,
      process.env.JWT_SECRET
    )) as ITokenData;

    if (!data.id || !data.password) {
      throw 'token no store data';
    }

    const user = await User.findOne({
      where: {
        id: data.id,
      },
    });

    if (!user || !this.checkUser(user, data.password)) {
      throw new Error('no has user or not valid password');
    }

    return this.get(user.id);
  };

  private checkUser = (user: User, password: string) => {
    const _hash = crypto
      .pbkdf2Sync(password, user.salt, 1000, 100, 'sha512')
      .toString('hex');
    return user.hash === _hash;
  };
}
