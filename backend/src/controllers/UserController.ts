import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';

class UserController {
  private _service: UserService;

  constructor() {
    this._service = new UserService();

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    const token = await this._service.login(req.body);
    res.status(StatusCodes.OK).json({ token });
  }

  async register(req: Request, res: Response): Promise<void> {
    await this._service.register(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Usuário registrado com sucesso' });
  }
}

export default UserController;
