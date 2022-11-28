import { IUserCreationAttrs } from '../database/models/User';

export default interface IRegister extends IUserCreationAttrs {
  password: string;
}
