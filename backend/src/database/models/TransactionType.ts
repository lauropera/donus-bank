import Sequelize from 'sequelize';
import db from '.';
import Transaction from './Transaction';

interface ITransactionType {
  id: number;
  name: string;
}

type ITransactionTypeCreation = Omit<ITransactionType, 'id'>;

class TransactionTypes extends Sequelize.Model<
ITransactionType,
ITransactionTypeCreation
> {
  declare id: number;
  declare balance: number;
}

TransactionTypes.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'TransactionTypes',
  },
);

TransactionTypes.hasMany(Transaction, {
  foreignKey: 'transaction_type',
  as: 'transactions',
});

Transaction.belongsTo(TransactionTypes, {
  foreignKey: 'transaction_type',
  as: 'transactionType',
});

export default TransactionTypes;
export { ITransactionType, TransactionTypes };
