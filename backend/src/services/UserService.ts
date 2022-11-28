import { compare } from 'bcryptjs';
import { Schema } from 'joi';
import HttpException from '../utils/HttpException';
import { ILogin, IRegister } from '../interfaces';
import User from '../database/models/User';
import { loginSchema } from './utils/validations/schemas';
import Token from './utils/TokenUtils';

class UserService {
  private _model = User;
  private _tokenUtils = Token;

  private static validateCredentialsSchema(
    schema: Schema,
    credentials: ILogin | IRegister,
  ): void {
    const { error } = schema.validate(credentials);
    if (error) throw new HttpException(400, error.message);
  }

  async login(credentials: ILogin): Promise<string> {
    UserService.validateCredentialsSchema(loginSchema, credentials);

    const user = await this._model.findOne({ where: { cpf: credentials.cpf } });

    if (!user || !(await compare(credentials.password, user.password))) {
      throw new HttpException(401, 'CPF ou senha inválidos');
    }

    const token = await this._tokenUtils.generate(user);
    return token;
  }
}

export default UserService;
