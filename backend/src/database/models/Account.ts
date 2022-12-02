import Sequelize from 'sequelize';
import db from '.';
import IAccount, { IAccountCreation } from '../../interfaces/IAccount';

class Account extends Sequelize.Model<IAccount, IAccountCreation> {
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
export { IAccount, IAccountCreation };
