import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addConstraint('Orders', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'fk_orders_customer',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeConstraint('Orders', 'fk_orders_customer');
  },
};
