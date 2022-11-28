import Transaction, { ITransaction } from '../database/models/Transaction';

class TransactionService {
  private _model = Transaction;

  async getAll(): Promise<ITransaction> {}
}

export default TransactionService;
