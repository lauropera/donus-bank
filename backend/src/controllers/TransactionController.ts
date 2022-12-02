import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from '../services';
import {
  TransactionFilter,
  TransactionMethod,
} from '../interfaces/ITransaction';

class TransactionController {
  private _service: TransactionService;

  constructor() {
    this._service = new TransactionService();

    this.listAll = this.listAll.bind(this);
    this.create = this.create.bind(this);
    this.deposit = this.deposit.bind(this);
  }

  async listAll(req: Request, res: Response): Promise<void> {
    const { filter, starts, ends } = req.query;

    const auth = req.headers.authorization || '';

    const transactions = await this._service.getAll(
      auth,
      filter as TransactionFilter | undefined,
      starts as string | undefined,
      ends as string | undefined,
    );

    res.status(StatusCodes.OK).json(transactions);
  }

  async create(req: Request, res: Response): Promise<void> {
    const auth = req.headers.authorization || '';

    const { type } = req.query;

    await this._service.insert(auth, type as TransactionMethod, req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Transação realizada com sucesso' });
  }

  async deposit(req: Request, res: Response): Promise<void> {
    const auth = req.headers.authorization || '';

    await this._service.deposit(auth, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: 'Depósito realizado com sucesso' });
  }
}

export default TransactionController;
