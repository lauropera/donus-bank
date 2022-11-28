import { NextFunction, Request, Response } from 'express';
import Token from '../services/utils/TokenUtils';

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token: string = req.headers.authorization || '';
  res.locals.user = await Token.authenticate(token, next);
  next();
}

export default authMiddleware;
