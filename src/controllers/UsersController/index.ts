import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User, { IUserAttributes } from '../../database/models/user';
import { ICreateUserData, ITokenData } from './types';
import { uuidv4 } from '../../common/uuidv4';
import { UserRefreshToken } from '../../database/models';

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

    const access_token = jwt.sign(
      {
        email,
        password,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30m',
      }
    );

    const clientId = uuidv4();
    const refresh_token = jwt.sign(
      {
        password,
        user_id: user.id,
        client_id: clientId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '14d',
      }
    );

    await UserRefreshToken.destroy({
      where: {
        userId: user.id,
      },
    });

    await UserRefreshToken.create({
      clientId: clientId,
      userId: user.id,
      refreshToken: refresh_token,
    });

    return {
      access_token,
      refresh_token,
      user: user.toJSON(),
    };
  };

  checkRefreshToken = async (token: string, client_id: string) => {
    if (!process.env.JWT_SECRET) {
      throw 'no has JWT_SECRET';
    }
    const payload = await this.getRefreshTokenPayload(token);
    if (!payload) {
      return false;
    }
    const result = (await UserRefreshToken.findOne({
      where: {
        userId: payload['user_id'],
        clientId: payload['client_id'],
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    })) as UserRefreshToken & { user: User };
    const user = result?.user;
    if (!user) {
      return false;
    }
    return (
      result?.refreshToken === token &&
      result.clientId === client_id &&
      this.checkUser(user, payload.password)
    );
  };

  getRefreshTokenPayload = async (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw 'no has JWT_SECRET';
    }
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    if (
      typeof data === 'string' ||
      (!data['user_id'] && !data['client_id'] && !data['password'])
    ) {
      return null;
    }
    return {
      user_id: data['user_id'],
      client_id: data['client_id'],
      password: data['password'],
    };
  };

  checkAccessToken = async (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw 'no has JWT_SECRET';
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET);

    if (typeof data === 'string') {
      throw 'token no store data';
    }

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
