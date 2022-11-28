import bcrypt from 'bcryptjs';
import { Schema } from 'joi';
import db from '../database/models';
import { ILogin, IRegister } from '../interfaces';
import { loginSchema, registerSchema } from './utils/validations/schemas';
import HttpException from '../utils/HttpException';
import User from '../database/models/User';
import Token from './utils/TokenUtils';
import Account from '../database/models/Account';

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

    const user = await this._model.findOne({ where: { cpf: credentials.cpf } });
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new HttpException(401, 'CPF ou senha inválidos');
    }

    const token = await this._tokenUtils.generate(user);
    return token;
  }

  private async checkIfUserExists(cpf: string): Promise<void> {
    const user = await this._model.findOne({ where: { cpf } });
    if (user) throw new HttpException(409, 'CPF já cadastrado');
  }

  async register(credentials: IRegister): Promise<void> {
    UserService.validateCredentials(registerSchema, credentials);
    await this.checkIfUserExists(credentials.cpf);

    const transaction = await db.transaction();
    try {
      const { id: accountId } = await this._accountModel.create(
        {},
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
}

export default UserService;
