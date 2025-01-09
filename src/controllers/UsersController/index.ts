import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User, { IUserAttributes } from '../../database/models/user';
import { ICreateUserData, ITokenData } from './types';
import { uuidv4 } from '../../common/uuidv4';
import { UserRefreshToken } from '../../database/models';
import { UNAUTHORIZED_CODE_ERROR } from '../../constants';

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

  refreshTokens = async (email: string, deviceId: string) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw 'no has ACCESS_TOKEN_SECRET';
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw 'no has REFRESH_TOKEN_SECRET';
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw {
        status: 'error',
        message: 'Ошибка авторизации',
      };
    }

    const access_token = jwt.sign(
      {
        email,
        id: user.id,
        deviceId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: Number(process.env.MAX_AGE_ACCESS_TOKEN_SECONDS),
      }
    );

    const MAX_AGE_REFRESH_TOKEN_SECONDS = Number(
      process.env.MAX_AGE_REFRESH_TOKEN_SECONDS
    );

    if (!MAX_AGE_REFRESH_TOKEN_SECONDS) {
      throw {
        status: 'error',
        message: 'Ошибка авторизации',
      };
    }
    const expiresAt = new Date(
      Date.now() + MAX_AGE_REFRESH_TOKEN_SECONDS * 1000
    );

    const refresh_token = jwt.sign(
      {
        user_id: user.id,
        device_id: deviceId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: MAX_AGE_REFRESH_TOKEN_SECONDS,
      }
    );

    await UserRefreshToken.destroy({
      where: {
        userId: user.id,
        deviceId: deviceId,
      },
    });

    await UserRefreshToken.create({
      userId: user.id,
      refreshToken: refresh_token,
      deviceId,
      expiresAt,
    });

    return {
      access_token,
      refresh_token,
      user: user.toJSON(),
    };
  };

  createToken = async (email: string, password: string, deviceId: string) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw 'no has ACCESS_TOKEN_SECRET';
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw 'no has REFRESH_TOKEN_SECRET';
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw {
        status: 'error',
        message: 'Ошибка авторизации',
      };
    }

    if (!this.validateUser(user, password)) {
      throw {
        status: 'error',
        message: 'Ошибка авторизации',
      };
    }

    const access_token = jwt.sign(
      {
        email,
        id: user.id,
        deviceId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: Number(process.env.MAX_AGE_ACCESS_TOKEN_SECONDS),
      }
    );

    const MAX_AGE_REFRESH_TOKEN_SECONDS = Number(
      process.env.MAX_AGE_REFRESH_TOKEN_SECONDS
    );

    if (!MAX_AGE_REFRESH_TOKEN_SECONDS) {
      throw {
        status: 'error',
        message: 'Ошибка авторизации',
      };
    }
    const expiresAt = new Date(
      Date.now() + MAX_AGE_REFRESH_TOKEN_SECONDS * 1000
    );

    const refresh_token = jwt.sign(
      {
        user_id: user.id,
        device_id: deviceId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: MAX_AGE_REFRESH_TOKEN_SECONDS,
      }
    );

    await UserRefreshToken.destroy({
      where: {
        userId: user.id,
        deviceId: deviceId,
      },
    });

    await UserRefreshToken.create({
      userId: user.id,
      refreshToken: refresh_token,
      deviceId,
      expiresAt,
    });

    return {
      access_token,
      refresh_token,
      user: user.toJSON(),
    };
  };

  checkRefreshToken = async (token: string) => {
    try {
      const payload = await this.getRefreshTokenPayload(token);
      if (!payload) {
        return false;
      }
      const result = (await UserRefreshToken.findOne({
        where: {
          userId: payload['user_id'],
          deviceId: payload['device_id'],
          refreshToken: token,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      })) as UserRefreshToken & { user: User };
      const user = result?.user;
      return !!user;
    } catch (error: any) {
      const name = error['name'];
      switch (name) {
        case 'TokenExpiredError':
        default:
          throw new Error(UNAUTHORIZED_CODE_ERROR);
      }
    }
  };

  getRefreshTokenPayload = async (token: string) => {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw 'no has REFRESH_TOKEN_SECRET';
    }
    const data = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (typeof data === 'string' || !data['user_id']) {
      return null;
    }
    return {
      user_id: data['user_id'],
      device_id: data['device_id'],
    };
  };

  checkAccessToken = async (token: string) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw 'no has ACCESS_TOKEN_SECRET';
    }

    const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (typeof data === 'string') {
      throw 'token no store data';
    }

    if (!data.id) {
      throw 'token no store data';
    }

    const user = await User.findOne({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      throw new Error('no has user or not valid password');
    }

    return this.get(user.id);
  };

  private validateUser = (user: User, password: string) => {
    const _hash = crypto
      .pbkdf2Sync(password, user.salt, 1000, 100, 'sha512')
      .toString('hex');
    return user.hash === _hash;
  };
}
