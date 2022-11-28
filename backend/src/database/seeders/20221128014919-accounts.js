'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Accounts', [
      {
        balance: 12.06,
      },
      {
        balance: 21.07,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
