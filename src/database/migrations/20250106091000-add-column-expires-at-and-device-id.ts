'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn('UserRefreshTokens', 'expiresAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('UserRefreshTokens', 'deviceId', {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeColumn('UserRefreshTokens', 'expiresAt');
    await queryInterface.removeColumn('UserRefreshTokens', 'deviceId');
  },
};
