import Offer from './offer';
import Order from './order';
import Review from './review';
import User from './user';
import File from './file';
import Task from './task';
import Track from './track';
import UserRefreshToken from './userRefreshToken';
import Food from './food';
import MealEntry from './mealEntrie';
import MealTimer from './mealTimer';
import FoodUser from './foodUser';
import UserProgram from './userProgram';
import UserProgramMealEntry from './userProgramMealEntries';
import Dish from './dish';
import DishFoods from './dishFoods';

UserProgram.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

User.belongsToMany(Food, { through: FoodUser, foreignKey: 'foodId' });
Food.belongsToMany(User, { through: FoodUser, foreignKey: 'userId' });

MealEntry.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

UserProgram.belongsToMany(MealEntry, {
  through: UserProgramMealEntry,
  foreignKey: 'userId',
  as: 'mealEntry',
});

MealEntry.belongsTo(UserProgram, {
  as: 'userProgram',
  foreignKey: {
    name: 'userProgramId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

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

Dish.belongsToMany(Food, {
  through: 'DishFoods', // Название промежуточной таблицы
  foreignKey: 'dishId',
  otherKey: 'foodId',
  as: 'foods', // Задаём алиас
});

Dish.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

// Food has many MealEntries
Food.hasMany(MealEntry, {
  foreignKey: 'entryId',
  constraints: false, // Отключаем ограничения внешнего ключа, так как он используется полиморфно
  scope: { entryType: 'food' }, // Указываем, что для Food entryType = 'food'
});

MealEntry.belongsTo(Food, {
  foreignKey: 'entryId',
  constraints: false,
  as: 'food',
});

// Dish has many MealEntries
Dish.hasMany(MealEntry, {
  foreignKey: 'entryId',
  constraints: false,
  scope: { entryType: 'dish' }, // Указываем, что для Dish entryType = 'dish'
});

MealEntry.belongsTo(Dish, {
  foreignKey: 'entryId',
  constraints: false,
  as: 'dish',
});

export {
  Offer,
  Order,
  Review,
  User,
  File,
  Task,
  Track,
  UserRefreshToken,
  Food,
  MealEntry as Meal,
  MealTimer,
  FoodUser,
  UserProgram,
  Dish,
  DishFoods,
};
