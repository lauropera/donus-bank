'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Arezu',
        cpf: '123.456.789-10',
        password:
          '$2a$08$ApIRb.TBtlq5.aVC/jJOFOSTySPw5MbpvsjibNoE6pg0teN.y0Dq2',
        // senha: pokepass
        account_id: 1,
      },
      {
        name: 'Red',
        cpf: '987.654.321-10',
        password:
          '$2a$08$7yX3jde42BQGNour2LAWjOG3hBpr7x27zWm8j8fTPZeIxmSofoRSC',
        // senha: pokepass123
        account_id: 2,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
