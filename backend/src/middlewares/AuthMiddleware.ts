import { NextFunction, Request, Response } from 'express';
import Token from '../services/utils/TokenUtils';

async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token: string = req.headers.authorization || '';
  req.body.user = await Token.authenticate(token, next);
  next();
}

export default authMiddleware;
