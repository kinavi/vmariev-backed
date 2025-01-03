'use strict';
import { DataTypes, QueryInterface } from 'sequelize';
import { DishStatus } from '../models/dish';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Dishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: DataTypes.ENUM(DishStatus.ACTIVE, DishStatus.CLOSE),
        allowNull: false,
        defaultValue: DishStatus.ACTIVE,
      },
      isDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('Dishes');
  },
};
