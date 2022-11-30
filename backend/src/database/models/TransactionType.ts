import Sequelize from 'sequelize';
import db from '.';
import Transaction from './Transaction';
import ITransactionType, {
  ITransactionTypeCreation,
} from '../../interfaces/ITransactionType';

class TransactionType extends Sequelize.Model<
ITransactionType,
ITransactionTypeCreation
> {
  declare id: number;
  declare balance: number;
}

TransactionType.init(
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

TransactionType.hasMany(Transaction, { foreignKey: 'transaction_type_id' });

Transaction.belongsTo(TransactionType, {
  foreignKey: 'transaction_type_id',
  as: 'transactionType',
});

export default TransactionType;
