'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Transactions', [
      {
        owner_account_id: 1,
        receiver_account_id: 2,
        value: 30.00,
        created_at: Sequelize.fn('now')
      },
      {
        owner_account_id: 1,
        receiver_account_id: 2,
        value: 11.90,
        created_at: Sequelize.fn('now')
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
