import Sequelize from 'sequelize';
import db from '.';
import Account from './Account';

interface IUser {
  id: number;
  name: string;
  cpf: string;
  password: string;
  accountId: number;
}

type IUserCreation = Omit<IUser, 'id, accountId'>;

type IUserReturned = Omit<IUser, 'password'>;

class User extends Sequelize.Model<IUser, IUserCreation> {
  declare id: number;
  declare name: string;
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
export { IUser, IUserCreation, IUserReturned };
