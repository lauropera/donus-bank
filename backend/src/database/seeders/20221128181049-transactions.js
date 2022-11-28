'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Transactions', [
      {
        owner_account_id: 1,
        receiver_account_id: 2,
        value: 30.00,
      },
      {
        owner_account_id: 1,
        receiver_account_id: 2,
        value: 11.90,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
