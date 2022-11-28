import Account from '../database/models/Account';
import Transaction, { ITransaction } from '../database/models/Transaction';

class TransactionService {
  private _model = Transaction;

  async getAll(ownerAccountId: number): Promise<ITransaction[]> {
    const transactions = await this._model.findAll({
      include: [
        { model: Account, as: 'ownerAccount' },
        { model: Account, as: 'receiverAccount' },
      ],
      where: { ownerAccountId },
    });
    return transactions;
  }
}

export default TransactionService;
