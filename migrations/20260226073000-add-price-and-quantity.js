'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Merchants', 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10000
    });

    await queryInterface.addColumn('Transactions', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'quantity');
    await queryInterface.removeColumn('Merchants', 'price');
  }
};
