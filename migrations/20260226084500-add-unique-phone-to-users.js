'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [duplicates] = await queryInterface.sequelize.query(`
      SELECT phone, COUNT(*)::int AS total
      FROM "Users"
      GROUP BY phone
      HAVING COUNT(*) > 1
      ORDER BY total DESC, phone ASC;
    `);

    if (duplicates.length > 0) {
      const list = duplicates.map((item) => `${item.phone} (${item.total})`).join(', ');
      throw new Error(`Tidak bisa menambahkan unique constraint phone karena data duplikat: ${list}`);
    }

    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addConstraint('Users', {
      fields: ['phone'],
      type: 'unique',
      name: 'users_phone_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'users_phone_unique');
  }
};
