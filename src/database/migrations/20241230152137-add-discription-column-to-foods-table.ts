'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn('Foods', 'description', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeColumn('Foods', 'description');
  },
};
