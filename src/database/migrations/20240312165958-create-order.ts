import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      minNumberPages: {
        type: Sequelize.INTEGER,
      },
      maxNumberPages: {
        type: Sequelize.INTEGER,
      },
      warrantyDays: {
        type: Sequelize.INTEGER,
      },
      discription: {
        type: Sequelize.STRING,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      executorId: {
        type: Sequelize.INTEGER,
      },
      deadline: {
        type: Sequelize.DATE,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(
          'initial',
          'ready-for-work',
          'process',
          'warranty',
          'rework',
          'done'
        ),
        defaultValue: 'initial',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('Orders');
  },
};
