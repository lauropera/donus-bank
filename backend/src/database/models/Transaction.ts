import Sequelize from 'sequelize';
import ITransaction, {
  ITransactionCreation,
} from '../../interfaces/ITransaction';
import db from '.';
import Account from './Account';

class Transaction extends Sequelize.Model<ITransaction, ITransactionCreation> {
  declare id: number;
  declare ownerAccountId: number;
  declare receiverAccountId: number;
  declare value: number;
  declare transactionTypeId: number;
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
    transactionTypeId: Sequelize.INTEGER,
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
