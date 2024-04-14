import User from '../../database/models/user';

export const REVIEWS_ATTRIBUTS_PUBLIC = ['id', 'text', 'login'];
export const REVIEWS_ATTRIBUTS_PRIVATE = ['id', 'text', 'login', 'isActive'];

export const REVIEWS_INCLUDES = [
  {
    model: User,
    as: 'user',
  },
];
