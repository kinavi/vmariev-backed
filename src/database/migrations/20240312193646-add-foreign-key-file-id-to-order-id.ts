import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addConstraint('Files', {
      fields: ['orderId'],
      type: 'foreign key',
      name: 'fk_files_order',
      references: {
        table: 'Orders',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeConstraint('Files', 'fk_files_order');
  },
};
