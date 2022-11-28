import { JwtPayload } from 'jsonwebtoken';

export default interface ITokenPayload extends JwtPayload {
  data: {
    id: number;
    name: string;
  }
}
