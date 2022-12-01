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
    underscored: true,
    tableName: 'TransactionTypes',
  },
);

TransactionType.hasMany(Transaction, { foreignKey: 'transactionTypeId' });

Transaction.belongsTo(TransactionType, {
  foreignKey: 'transactionTypeId',
  as: 'transactionType',
});

export default TransactionType;
