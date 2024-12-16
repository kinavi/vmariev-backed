import { FastifyType } from '../types';
import { OrderTypeEnum } from '../database/models/order';
import { routs } from '.';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import UserProgram, {
  ActivityType,
  GoalType,
  SexType,
} from '../database/models/userProgram';

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
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
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
    type: 'object',
    required: ['id', 'title', 'proteins', 'fats', 'carbohydrates'],
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      proteins: { type: 'number' },
      fats: { type: 'number' },
      carbohydrates: { type: 'number' },
    },
  });

  fastify.addSchema({
    $id: 'UserProgram',
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
    },
  });

  fastify.addSchema({
    $id: 'MealEntry',
    type: 'object',
    required: ['id', 'food', 'user', 'weight', 'userProgram', 'createdAt'],
    properties: {
      id: { type: 'number' },
      food: { $ref: 'Food' },
      user: { $ref: 'User' },
      userProgram: { $ref: 'UserProgram' },
      weight: { type: 'number' },
      createdAt: { type: 'string' },
    },
  });

  fastify.register(routs, { prefix: '/api', logLevel: 'debug' });
};
