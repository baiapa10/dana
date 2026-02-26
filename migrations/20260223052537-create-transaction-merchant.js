'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionMerchants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      merchantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Merchants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('TransactionMerchants', {
      fields: ['transactionId', 'merchantId'],
      type: 'unique',
      name: 'transaction_merchants_transaction_merchant_unique'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TransactionMerchants');
  }
};
