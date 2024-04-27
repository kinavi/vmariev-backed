import Offer from './offer';
import Order from './order';
import Review from './review';
import User from './user';
import File from './file';
import Task from './task';
import Track from './track';
import UserRefreshToken from './userRefreshToken';

Order.belongsTo(User, {
  as: 'customer',
  foreignKey: {
    name: 'customerId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

Order.belongsTo(User, {
  as: 'executor',
  foreignKey: {
    name: 'executorId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

//review
Review.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

File.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

File.belongsTo(Order, {
  as: 'order',
  foreignKey: {
    name: 'orderId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

Order.hasMany(File, {
  as: 'files',
  foreignKey: {
    name: 'orderId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

User.hasMany(File, {
  as: 'files',
  foreignKey: {
    name: 'userId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

User.hasMany(Task, {
  as: 'tasks',
  foreignKey: {
    name: 'userId',
    allowNull: true,
  },
  foreignKeyConstraint: true,
});

Task.belongsTo(User, {
  as: 'task',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

Task.hasMany(Track, {
  as: 'tracks',
  foreignKey: {
    name: 'taskId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

Track.belongsTo(Task, {
  as: 'track',
  foreignKey: {
    name: 'taskId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

UserRefreshToken.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

export { Offer, Order, Review, User, File, Task, Track, UserRefreshToken };
