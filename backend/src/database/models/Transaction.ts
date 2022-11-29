import Sequelize from 'sequelize';
import db from '.';
import Account from './Account';

interface ITransaction {
  id: number;
  ownerAccountId: number;
  receiverAccountId: number;
  value: number;
  createdAt: Date;
}

type TransactionType = 'cpf' | 'email';
type TransactionFilter = 'sent' | 'received' | 'date';

interface ITransactionCreation {
  email?: string;
  cpf?: string;
  ownerAccountId: number;
  receiverAccountId: number;
  value: number;
}

class Transaction extends Sequelize.Model<ITransaction, ITransactionCreation> {
  declare id: number;
  declare ownerAccountId: number;
  declare receiverAccountId: number;
  declare value: number;
  declare createdAt: Date;
}

Transaction.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerAccountId: Sequelize.INTEGER,
    receiverAccountId: Sequelize.INTEGER,
    value: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
  },
  {
    sequelize: db,
    tableName: 'Transactions',
    updatedAt: false,
    underscored: true,
  },
);

Transaction.belongsTo(Account, {
  foreignKey: 'ownerAccountId',
  as: 'ownerAccount',
});

Transaction.belongsTo(Account, {
  foreignKey: 'receiverAccountId',
  as: 'receiverAccount',
});

Account.hasMany(Transaction, { foreignKey: 'ownerAccountId' });
Account.hasMany(Transaction, { foreignKey: 'receiverAccountId' });

export default Transaction;
export {
  ITransaction,
  ITransactionCreation,
  TransactionType,
  TransactionFilter,
};
