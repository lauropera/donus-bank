import Sequelize from 'sequelize';
import db from '.';

interface IAccount {
  id: number;
  balance?: number;
}

type IAccountCreationAttrs = Omit<IAccount, 'id'>;

class Account extends Sequelize.Model<IAccount, IAccountCreationAttrs> {
  declare id: number;
  declare balance: number;
}

Account.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: Sequelize.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Accounts',
    underscored: true,
  },
);

export default Account;
export { IAccount, IAccountCreationAttrs };
