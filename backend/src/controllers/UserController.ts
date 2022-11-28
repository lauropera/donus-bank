import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';

class UserController {
  private _service: UserService;

  constructor() {
    this._service = new UserService();

    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    const token = await this._service.login(req.body);
    res.status(StatusCodes.OK).json({ token });
  }
}

export default UserController;
