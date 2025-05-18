'use strict';
import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('CoinPlannedTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TransactionCategories',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('income', 'expense', 'transfer'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      plannedDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      actualTransactionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CoinTransactions',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'skipped'),
        allowNull: false,
        defaultValue: 'pending',
      },
      currencyCharCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('CoinPlannedTransactions');
  },
};
