import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from '../services';

class TransactionController {
  private _service: TransactionService;

  constructor() {
    this._service = new TransactionService();

    this.listAll = this.listAll.bind(this);
    this.create = this.create.bind(this);
  }

  async listAll(req: Request, res: Response): Promise<void> {
    const {
      data: { id },
    } = req.body.user;

    const transactions = await this._service.getAll(id);
    res.status(StatusCodes.OK).json(transactions);
  }

  async create(req: Request, res: Response): Promise<void> {
    const {
      data: { id },
    } = req.body.user;

    await this._service.insert(id, req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Transação realizada com sucesso' });
  }
}

export default TransactionController;
