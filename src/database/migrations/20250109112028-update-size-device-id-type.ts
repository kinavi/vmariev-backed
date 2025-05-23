'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('UserRefreshTokens', 'deviceId', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('UserRefreshTokens', 'deviceId', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
