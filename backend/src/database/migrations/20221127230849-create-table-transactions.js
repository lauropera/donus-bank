'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      owner_account_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Accounts',
          key: 'id',
        },
      },
      receiver_account_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Accounts',
          key: 'id',
        },
      },
      value: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Transactions');
  },
};
