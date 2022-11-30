'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('TransactionTypes', [
      { name: 'Depósito' },
      { name: 'Transferência' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('TransactionTypes', null, {});
  },
};
