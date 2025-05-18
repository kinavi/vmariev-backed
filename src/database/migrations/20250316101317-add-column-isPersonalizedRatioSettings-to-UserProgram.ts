'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn(
      'UserPrograms',
      'isPersonalizedRatioSettings',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      }
    );
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeColumn(
      'UserPrograms',
      'isPersonalizedRatioSettings'
    );
  },
};
