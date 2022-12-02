import { JwtPayload } from 'jsonwebtoken';

export default interface ITokenPayload extends JwtPayload {
  id: number;
}
