import { IUserCreation } from '../database/models/User';

export default interface IRegister extends IUserCreation {
  password: string;
}
