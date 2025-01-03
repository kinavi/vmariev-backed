'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn('MealEntries', 'entryType', {
      type: Sequelize.ENUM('food', 'dish'),
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Удаление колонки `entryType` из таблицы `MealEntries`
    await queryInterface.removeColumn('MealEntries', 'entryType');
    // Удаление ENUM типа, чтобы не возникало ошибок при миграциях
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_MealEntries_entryType";'
    );
  },
};
