import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      salt: {
        type: Sequelize.STRING,
      },
      hash: {
        type: Sequelize.STRING,
      },
      login: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['executor', 'client', 'owner'],
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
    await queryInterface.dropTable('Users');
  },
};
