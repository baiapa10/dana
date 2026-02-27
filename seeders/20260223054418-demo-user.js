'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: 99,
        name: 'admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        phone: '08123456789',
        role: 'merchant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

    await queryInterface.sequelize.query(
      'SELECT setval(' + "'\"Users_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Users"));'
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' }, {});
    await queryInterface.sequelize.query(
      'SELECT setval(' + "'\"Users_id_seq\"'" + ', (SELECT COALESCE(MAX(id), 1) FROM "Users"));'
    );
  }
};
