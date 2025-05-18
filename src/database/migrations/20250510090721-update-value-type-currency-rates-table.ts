'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('CurrencyRubRates', 'value', {
      type: Sequelize.DECIMAL(10, 3),
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('CurrencyRubRates', 'value', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
