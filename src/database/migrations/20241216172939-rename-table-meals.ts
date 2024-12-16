'use strict';
import { DataTypes, QueryInterface } from 'sequelize';
import { ActivityType, GoalType, SexType } from '../models/userProgram';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.renameTable('Meals', 'MealEntries');

  },
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.renameTable('MealEntries', 'Meals');
  },
};
