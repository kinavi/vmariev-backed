'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.renameColumn('MealEntries', 'foodId', 'entryId');
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.renameColumn('MealEntries', 'entryId', 'foodId');
  },
};
