import HttpException from '../utils/HttpException';
import Account from '../database/models/Account';
import Transaction, {
  ITransaction,
  ITransactionCreationAttrs,
} from '../database/models/Transaction';
import { transactionSchema } from './utils/validations/schemas';

class TransactionService {
  private _model = Transaction;

  private static validateTransaction(data: ITransactionCreationAttrs): void {
    const { error } = transactionSchema.validate(data);
    if (error) throw new HttpException(400, error.message);
  }

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

  async insert(
    userId: number,
    data: ITransactionCreationAttrs,
  ): Promise<void> {
    TransactionService.validateTransaction(data);
  }
}

export default TransactionService;
