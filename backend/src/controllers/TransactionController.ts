import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  TransactionFilter,
  TransactionType,
} from '../database/models/Transaction';
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
    } = res.locals.user;

    const { filter } = req.query;

    const transactions = await this._service.getAll(
      id,
      filter as TransactionFilter,
      req.body,
    );

    res.status(StatusCodes.OK).json(transactions);
  }

  async create(req: Request, res: Response): Promise<void> {
    const {
      data: { id },
    } = res.locals.user;

    const { transferType } = req.query;

    await this._service.insert(id, transferType as TransactionType, req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Transação realizada com sucesso' });
  }
}

export default TransactionController;
