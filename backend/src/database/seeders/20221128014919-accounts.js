'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Accounts', [
      {
        balance: 100,
      },
      {
        balance: 25.60,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accounts', null, {});
  },
};
