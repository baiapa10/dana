'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: bcrypt.hashSync('alice123', 10),
        phone: '081111111111',
        role: 'user',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        password: bcrypt.hashSync('bob123', 10),
        phone: '082222222222',
        role: 'merchant',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Profiles', [
      {
        id: 1,
        monthlyBudget: 5000000,
        currency: 'IDR',
        userId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        monthlyBudget: 7000000,
        currency: 'IDR',
        userId: 2,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Wallets', [
      {
        id: 1,
        balance: 1500000,
        status: 'active',
        userId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        balance: 3000000,
        status: 'active',
        userId: 2,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Transactions', [
      {
        id: 1,
        amount: 100000,
        walletId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        amount: 200000,
        walletId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        amount: 150000,
        walletId: 2,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('Merchants', [
      {
        id: 1,
        name: 'Coffee Shop',
        category: 'Food & Beverage',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Book Store',
        category: 'Retail',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.bulkInsert('TransactionMerchants', [
      {
        id: 1,
        transactionId: 1,
        merchantId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        transactionId: 2,
        merchantId: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        transactionId: 3,
        merchantId: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    await queryInterface.sequelize.query('SELECT setval(' + "'\"Users_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Users"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Profiles_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Profiles"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Wallets_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Wallets"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Transactions_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Transactions"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Merchants_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Merchants"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"TransactionMerchants_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "TransactionMerchants"));');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TransactionMerchants', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Wallets', null, {});
    await queryInterface.bulkDelete('Profiles', null, {});
    await queryInterface.bulkDelete('Merchants', null, {});
    await queryInterface.bulkDelete('Users', null, {});

    await queryInterface.sequelize.query('SELECT setval(' + "'\"Users_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Users"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Profiles_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Profiles"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Wallets_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Wallets"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Transactions_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Transactions"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"Merchants_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Merchants"));');
    await queryInterface.sequelize.query('SELECT setval(' + "'\"TransactionMerchants_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "TransactionMerchants"));');
  }
};
