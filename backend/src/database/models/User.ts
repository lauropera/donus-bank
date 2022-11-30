import Sequelize from 'sequelize';
import db from '.';
import Account from './Account';
import IUser, { IUserCreation } from '../../interfaces/IUser';

class User extends Sequelize.Model<IUser, IUserCreation> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare cpf: string;
  declare accountId: number;
  declare password: string;
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    cpf: Sequelize.STRING,
    password: Sequelize.STRING,
    accountId: Sequelize.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'Users',
    underscored: true,
  },
);

User.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
Account.hasOne(User, { foreignKey: 'accountId', as: 'user' });

export default User;
