'use strict';
import { DataTypes, QueryInterface } from 'sequelize';
import { ActivityType, GoalType, SexType } from '../models/userProgram';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('UserPrograms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM(SexType.MALE, SexType.FEMALE),
        allowNull: false,
        defaultValue: SexType.MALE,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      physicalActivity: {
        type: DataTypes.ENUM(
          ActivityType.LOW,
          ActivityType.LIGHT,
          ActivityType.MIDDLE,
          ActivityType.HIGH,
          ActivityType.EXTREME
        ),
        allowNull: false,
        defaultValue: ActivityType.LOW,
      },
      goal: {
        type: DataTypes.ENUM(
          GoalType.MASS_GAIN,
          GoalType.NORMAL,
          GoalType.WEIGHT_LOSS
        ),
        allowNull: false,
        defaultValue: GoalType.NORMAL,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      ratioCarbohydrates: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ratioProteins: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ratioFats: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      isExcludeActivity: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('UserPrograms');
  },
};
