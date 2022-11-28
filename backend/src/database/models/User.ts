import Sequelize from 'sequelize';
import db from '.';
import Account from './Account';

interface IUser {
  id: number;
  name: string;
  cpf: string;
  accountId: number;
}

type IUserCreationAttrs = Omit<IUser, 'id'>;

class User extends Sequelize.Model<IUser, IUserCreationAttrs> {
  declare id: number;
  declare name: string;
  declare cpf: string;
  declare accountId: number;
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
    accountId: Sequelize.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
    underscored: true,
  },
);

User.hasOne(Account, {
  foreignKey: 'accountId',
  as: 'account',
});

Account.belongsTo(User, {
  foreignKey: 'accountId',
  as: 'user',
});

export default User;
export { IUser, IUserCreationAttrs };
