import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { Schema } from 'joi';
import db from '../database/models';
import Token from './utils/TokenUtils';
import HttpException from '../utils/HttpException';
import { loginSchema, registerSchema } from './utils/validations/schemas';

import User from '../database/models/User';
import Account from '../database/models/Account';

import IUser from '../interfaces/IUser';
import { ILogin, IRegister } from '../interfaces';

class UserService {
  private _model = User;
  private _accountModel = Account;
  private _tokenUtils = Token;

  private static validateCredentials(
    schema: Schema,
    credentials: ILogin | IRegister,
  ): void {
    const { error } = schema.validate(credentials);
    if (error) throw new HttpException(400, error.message);
  }

  async login(credentials: ILogin): Promise<string> {
    UserService.validateCredentials(loginSchema, credentials);

    const user = await this._model.findOne({
      where: { email: credentials.email },
    });

    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new HttpException(
        401,
        !user ? 'Email não cadastrado' : 'Email ou senha inválidos',
      );
    }

    const token = await this._tokenUtils.generate(user.id);
    return token;
  }

  private async checkIfUserExists(credentials: IRegister): Promise<void> {
    const users = await this._model.findAll({
      where: {
        [Op.or]: [{ cpf: credentials.cpf }, { email: credentials.email }],
      },
    });

    if (users.some((user) => user.dataValues.email === credentials.email)) {
      throw new HttpException(409, 'Email já cadastrado');
    }

    if (users.length > 0) throw new HttpException(409, 'CPF já cadastrado');
  }

  async register(credentials: IRegister): Promise<void> {
    UserService.validateCredentials(registerSchema, credentials);
    await this.checkIfUserExists(credentials);

    const transaction = await db.transaction();
    try {
      const { id: accountId } = await this._accountModel.create(
        { balance: 0 },
        { transaction },
      );

      const encryptedPassword = await bcrypt.hash(credentials.password, 8);
      await this._model.create(
        { ...credentials, password: encryptedPassword, accountId },
        { transaction },
      );

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw new HttpException(400, 'Houve um problema ao cadastrar o usuário');
    }
  }

  async getUser(auth: string): Promise<IUser> {
    const { id } = await this._tokenUtils.authenticate(auth);

    const user = await this._model.findOne({
      attributes: { exclude: ['password', 'accountId'] },
      include: [{ model: Account, as: 'account' }],
      where: { id },
    });

    if (!user) throw new HttpException(404, 'Usuário não encontrado');
    return user;
  }
}

export default UserService;
