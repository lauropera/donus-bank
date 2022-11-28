import Sequelize from 'sequelize';
import db from '.';

interface ITransaction {
  id: number;
  ownerAccountId: number;
  receiverAccountId: number;
  value: number;
}

type ITransactionCreationAttrs = Omit<ITransaction, 'id'>;

class Transaction extends Sequelize.Model<
ITransaction,
ITransactionCreationAttrs
> {
  declare id: number;
  declare ownerAccountId: number;
  declare receiverAccountId: number;
  declare value: number;
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
  },
  {
    sequelize: db,
    timestamps: false,
    underscored: true,
  },
);

export default Transaction;
export { ITransaction, ITransactionCreationAttrs };
