'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Accounts', [
      {
        balance: 1221.06,
      },
      {
        balance: 2112.07,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accounts', null, {});
  },
};
