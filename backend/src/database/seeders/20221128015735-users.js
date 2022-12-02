'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Mallu Magalhães',
        email: 'mallu@artist.com',
        cpf: '71118137663',
        password:
          '$2a$08$1cg8tH8gaoXr77hMTkb/SOS/ixfvwRJV93dVdAk6Z/c5UMjmD2wyq',
        // senha: sambinhabom
        account_id: 1,
      },
      {
        name: 'Sebastian',
        cpf: '49798060318',
        email: 'sebastian@sebs.com',
        password:
          '$2a$08$mjEvVqV72LHMKTlTZXlBS.C74b8Uq6uRvPgGu5k5.xQ6koVzeontO',
        // senha: piano
        account_id: 2,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
