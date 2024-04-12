import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addConstraint('Reviews', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_review_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeConstraint('Reviews', 'fk_review_user');
  },
};
