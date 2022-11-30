import * as jwt from 'jsonwebtoken';
import HttpException from '../../utils/HttpException';
import { ITokenPayload } from '../../interfaces';

const SECRET = process.env.SECRET || 'jwt_secret';

class Token {
  static generate(id: number): string {
    return jwt.sign({ id }, SECRET, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
  }

  static async authenticate(token: string): Promise<ITokenPayload> {
    if (!token) throw new HttpException(401, 'Token é obrigatório');
    const payload = await jwt.verify(token, SECRET);
    return payload as ITokenPayload;
  }
}

export default Token;
