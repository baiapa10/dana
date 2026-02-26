'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [duplicates] = await queryInterface.sequelize.query(`
      SELECT email, COUNT(*)::int AS total
      FROM "Users"
      GROUP BY email
      HAVING COUNT(*) > 1
      ORDER BY total DESC, email ASC;
    `);

    if (duplicates.length > 0) {
      const list = duplicates.map((item) => `${item.email} (${item.total})`).join(', ');
      throw new Error(`Tidak bisa menambahkan unique constraint email karena data duplikat: ${list}`);
    }

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'users_email_unique');
  }
};
