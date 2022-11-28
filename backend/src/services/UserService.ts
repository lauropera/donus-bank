import { ILogin } from '../interfaces';
import User from '../database/models/User';

class UserService {
  private _model: User;

  async login(credentials: ILogin): Promise<string> {}
}

export default UserService;
