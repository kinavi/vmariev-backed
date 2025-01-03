'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('DishFoods', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      dishId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Dishes', // Название таблицы
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      foodId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Foods', // Название таблицы
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('DishFoods');
  },
};
