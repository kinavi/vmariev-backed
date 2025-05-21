import { FastifyType } from '../types';
import { OrderTypeEnum } from '../database/models/order';
import { routs } from '.';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import {
  ActivityType,
  GoalType,
  SexType,
} from '../database/models/userProgram';
import { DishStatus } from '../database/models/dish';
import { MealEntryType } from '../database/models/mealEntrie';
import { CoinTransactionType } from '../database/models/coinTransaction';
import { CoinPlannedTransactionStatusType } from '../database/models/coinPlannedTransaction';

export const swaggerPlugin: any = async (
  fastify: FastifyType,
  options: any
) => {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
    },
  });
  await fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  fastify.addSchema({
    $id: 'User',
    title: 'User',
    type: 'object',
    required: ['id', 'email', 'login', 'phone', 'role'],
    properties: {
      id: { type: 'number' },
      email: { type: 'string' },
      login: { type: 'string' },
      phone: { type: 'string' },
      role: {
        type: 'string',
      },
    },
  });

  fastify.addSchema({
    $id: 'SlimUser',
    title: 'SlimUser',
    type: 'object',
    required: ['id', 'email'],
    properties: {
      id: { type: 'number' },
      email: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'File',
    type: 'object',
    required: [
      'id',
      'fieldname',
      'originalname',
      'encoding',
      'destination',
      'filename',
      'mimetype',
      'path',
      'size',
    ],
    properties: {
      id: { type: 'number' },
      isPublic: { type: 'boolean' },
      fieldname: { type: 'string' },
      originalname: { type: 'string' },
      encoding: { type: 'string' },
      destination: { type: 'string' },
      filename: { type: 'string' },
      mimetype: { type: 'string' },
      path: { type: 'string' },
      size: { type: 'number' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      order: {
        allOf: [{ $ref: 'Order' }, { type: 'object', nullable: true }],
      },
      user: {
        allOf: [{ $ref: 'User' }, { type: 'object', nullable: true }],
      },
    },
  });
  fastify.addSchema({
    $id: 'Review',
    title: 'Review',
    type: 'object',
    required: ['id', 'text'],
    properties: {
      id: { type: 'number' },
      text: { type: 'string' },
      user: {
        allOf: [{ $ref: 'User' }, { type: 'object', nullable: true }],
      },
      login: { type: 'string' },
      isActive: { type: 'boolean' },
      createdAt: { type: 'string' },
    },
  });
  fastify.addSchema({
    $id: 'Order',
    title: 'Order',
    type: 'object',
    required: [
      'id',
      'topic',
      'subject',
      'type',
      'discription',
      'deadline',
      'customer',
      'price',
      'status',
      'createdAt',
      'files',
    ],
    properties: {
      id: { type: 'number' },
      topic: { type: 'string' },
      discription: { type: 'string' },
      deadline: { type: 'string' },
      price: { type: 'number' },
      status: {
        type: 'string',
        enum: Object.values(OrderTypeEnum),
      },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      customer: { $ref: 'User' },
      files: {
        type: 'array',
        items: { $ref: 'File' },
      },
    },
  });
  fastify.addSchema({
    $id: 'Offer',
    title: 'Offer',
    type: 'object',
    required: ['id', 'email', 'phone'],
    properties: {
      id: { type: 'number' },
      email: { type: 'string' },
      phone: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  });
  fastify.addSchema({
    $id: 'Task',
    title: 'Task',
    type: 'object',
    required: ['id', 'name', 'userId', 'totalTime'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      description: { type: 'string' },
      userId: { type: 'number' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      currentTrack: {
        allOf: [{ $ref: 'Track' }, { type: 'object', nullable: true }],
      },
      totalTime: { type: 'number' },
    },
  });
  fastify.addSchema({
    $id: 'Track',
    title: 'Track',
    type: 'object',
    required: ['id', 'dateStart', 'limit'],
    properties: {
      id: { type: 'number' },
      dateStart: { type: 'string' },
      dateStop: { type: 'string', nullable: true },
      limit: { type: 'number' },
      deltaTime: { type: 'number' },
    },
  });

  fastify.addSchema({
    $id: 'Food',
    title: 'Food',
    type: 'object',
    required: ['id', 'title', 'proteins', 'fats', 'carbohydrates'],
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      proteins: { type: 'number' },
      fats: { type: 'number' },
      carbohydrates: { type: 'number' },
      description: { type: 'string', nullable: true },
    },
  });

  fastify.addSchema({
    $id: 'UserProgram',
    title: 'UserProgram',
    type: 'object',
    required: [
      'id',
      'sex',
      'age',
      'physicalActivity',
      'goal',
      'weight',
      'height',
      'ratioCarbohydrates',
      'ratioProteins',
      'ratioFats',
      'isExcludeActivity',
      'isPersonalizedRatioSettings',
    ],
    properties: {
      id: { type: 'number' },
      sex: { type: 'string', enum: [SexType.MALE, SexType.FEMALE] },
      age: { type: 'number' },
      physicalActivity: {
        type: 'string',
        enum: [
          ActivityType.LOW,
          ActivityType.LIGHT,
          ActivityType.MIDDLE,
          ActivityType.HIGH,
          ActivityType.EXTREME,
        ],
      },
      goal: {
        type: 'string',
        enum: [GoalType.MASS_GAIN, GoalType.NORMAL, GoalType.WEIGHT_LOSS],
      },
      weight: { type: 'number' },
      height: { type: 'number' },
      ratioCarbohydrates: { type: 'number' },
      ratioProteins: { type: 'number' },
      ratioFats: { type: 'number' },
      isExcludeActivity: { type: 'boolean' },
      isPersonalizedRatioSettings: { type: 'boolean' },
    },
  });

  fastify.addSchema({
    $id: 'Dish',
    title: 'Dish',
    type: 'object',
    required: ['id', 'title', 'status', 'createdAt', 'foods', 'user'],
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      status: {
        type: 'string',
        enum: [DishStatus.ACTIVE, DishStatus.CLOSE],
      },
      createdAt: { type: 'string' },
      foods: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'id',
            'title',
            'proteins',
            'fats',
            'carbohydrates',
            'dishInfo',
          ],
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            proteins: { type: 'number' },
            fats: { type: 'number' },
            carbohydrates: { type: 'number' },
            dishInfo: {
              type: 'object',
              required: ['weight'],
              properties: {
                weight: { type: 'number' },
              },
            },
          },
        },
      },
      user: {
        $ref: 'SlimUser',
      },
    },
  });

  fastify.addSchema({
    $id: 'DishMealEntry',
    title: 'DishMealEntry',
    type: 'object',
    required: [
      'id',
      'dish',
      'user',
      'weight',
      'userProgram',
      'createdAt',
      'entryType',
    ],
    properties: {
      id: { type: 'number' },
      user: { $ref: 'SlimUser' },
      userProgram: { $ref: 'UserProgram' },
      weight: { type: 'number' },
      createdAt: { type: 'string' },
      entryType: {
        type: 'string',
        value: 'dish',
        enum: [MealEntryType.dish],
      },
      dish: { $ref: 'Dish' },
    },
  });

  fastify.addSchema({
    $id: 'FoodMealEntry',
    title: 'FoodMealEntry',
    type: 'object',
    required: [
      'id',
      'food',
      'user',
      'weight',
      'userProgram',
      'createdAt',
      'entryType',
    ],
    properties: {
      id: { type: 'number' },
      user: { $ref: 'SlimUser' },
      userProgram: { $ref: 'UserProgram' },
      weight: { type: 'number' },
      createdAt: { type: 'string' },
      entryType: {
        type: 'string',
        value: 'food',
        enum: [MealEntryType.food],
      },
      food: { $ref: 'Food' },
    },
  });

  fastify.addSchema({
    $id: 'UserActivityEntry',
    title: 'UserActivityEntry',
    type: 'object',
    required: ['id', 'user', 'name', 'calories', 'createdAt'],
    properties: {
      id: { type: 'number' },
      user: { $ref: 'SlimUser' },
      calories: { type: 'number' },
      name: { type: 'string' },
      createdAt: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'BaseCurrencySetting',
    title: 'BaseCurrencySetting',
    type: 'object',
    required: ['id', 'currencyCharCode'],
    properties: {
      id: { type: 'number' },
      currencyCharCode: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'TransactionCategory',
    title: 'TransactionCategory',
    type: 'object',
    required: ['id', 'title', 'color'],
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      color: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'CoinTransaction',
    title: 'CoinTransaction',
    type: 'object',
    required: [
      'id',
      'title',
      'amount',
      'type',
      'currencyCharCode',
      'date',
      'createdAt',
    ],
    properties: {
      id: { type: 'number' },
      category: {
        $ref: 'TransactionCategory',
      },
      title: { type: 'string' },
      description: { type: 'string' },
      amount: { type: 'number' },
      type: {
        type: 'string',
        enum: [
          CoinTransactionType.expense,
          CoinTransactionType.income,
          CoinTransactionType.transfer,
        ],
      },
      currencyCharCode: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      createdAt: {
        type: 'string',
      },
    },
  });

  fastify.addSchema({
    $id: 'CoinPlannedTransaction',
    title: 'CoinPlannedTransaction',
    type: 'object',
    required: [
      'id',
      'title',
      'amount',
      'type',
      'status',
      'currencyCharCode',
      'createdAt',
    ],
    properties: {
      id: { type: 'number' },
      category: {
        $ref: 'TransactionCategory',
      },
      title: { type: 'string' },
      description: { type: 'string' },
      amount: { type: 'number' },
      type: {
        type: 'string',
        enum: [
          CoinTransactionType.expense,
          CoinTransactionType.income,
          CoinTransactionType.transfer,
        ],
      },
      date: {
        type: 'string',
        nullable: true,
      },
      actualTransaction: {
        $ref: 'CoinTransaction',
      },
      status: {
        type: 'string',
        enum: [
          CoinPlannedTransactionStatusType.completed,
          CoinPlannedTransactionStatusType.pending,
          CoinPlannedTransactionStatusType.skipped,
        ],
      },
      currencyCharCode: {
        type: 'string',
      },
      createdAt: {
        type: 'string',
      },
    },
  });

  fastify.addSchema({
    $id: 'UserBalance',
    title: 'UserBalance',
    type: 'object',
    required: ['currency', 'amount'],
    properties: {
      currency: { type: 'string' },
      amount: { type: 'number' },
      updatedAt: {
        type: 'string',
      },
    },
  });

  fastify.addSchema({
    $id: 'UserPlannedBalance',
    title: 'UserPlannedBalance',
    type: 'object',
    required: ['currency', 'amount'],
    properties: {
      currency: { type: 'string' },
      amount: { type: 'number' },
      updatedAt: {
        type: 'string',
      },
    },
  });

  fastify.register(routs, { prefix: '/api', logLevel: 'debug' });
};
