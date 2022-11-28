import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../../database/models/User';
import { ITokenPayload } from '../../interfaces';

const SECRET = process.env.SECRET || 'jwt_secret';

class Token {
  static generate({ id, name, email }: IUser): string {
    return jwt.sign({ data: { id, name, email } }, SECRET, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });
  }

  static async authenticate(
    token: string,
    next: NextFunction,
  ): Promise<ITokenPayload | void> {
    try {
      const payload = await jwt.verify(token, SECRET);
      return payload as ITokenPayload;
    } catch (e) {
      return next({ status: 401, message: 'Token inválido' });
    }
  }
}

export default Token;
