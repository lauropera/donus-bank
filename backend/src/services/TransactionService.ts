import db from '../database/models';
import HttpException from '../utils/HttpException';
import Account from '../database/models/Account';
import Transaction, {
  ITransaction,
  ITransactionCreation,
  TransactionType,
} from '../database/models/Transaction';
import { transactionSchema } from './utils/validations/schemas';
import User from '../database/models/User';

class TransactionService {
  private _model = Transaction;
  private _userModel = User;
  private _accountModel = Account;

  private static validateTransaction(data: ITransactionCreation): void {
    const { error } = transactionSchema.validate(data);
    if (error) throw new HttpException(400, error.message);
  }

  async getAll(ownerAccountId: number): Promise<ITransaction[]> {
    const transactions = await this._model.findAll({
      attributes: {
        exclude: ['ownerAccountId', 'receiverAccountId'],
      },
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
    transferType: TransactionType,
    transactionData: ITransactionCreation,
  ): Promise<void> {
    TransactionService.validateTransaction(transactionData);

    const ownerUser = await this._userModel.findByPk(userId);
    const receiverUser = await this._userModel.findOne({
      where: { [transferType]: transactionData[transferType] },
    });

    const ownerAccount = await this._accountModel.findByPk(
      ownerUser?.accountId,
    );
    const receiverAccount = await this._accountModel.findByPk(
      receiverUser?.accountId,
    );

    if (!ownerAccount || !receiverAccount) {
      throw new HttpException(
        404,
        `Dados inválidos, verifique se o ${transferType} está correto`,
      );
    }

    if (ownerAccount.id === receiverAccount.id) {
      throw new HttpException(
        422,
        'Não é possível fazer uma transferência para si mesmo',
      );
    }

    if (ownerAccount.balance < transactionData.value) {
      throw new HttpException(422, 'Saldo insuficiente');
    }

    const transaction = await db.transaction();
    try {
      await this._model.create(
        {
          ownerAccountId: ownerAccount.id,
          receiverAccountId: receiverAccount.id,
          value: transactionData.value,
        },
        { transaction },
      );

      await this._accountModel.update(
        { balance: ownerAccount.balance - transactionData.value },
        { where: { id: ownerAccount.id }, transaction },
      );

      await this._accountModel.update(
        { balance: receiverAccount.balance + transactionData.value },
        { where: { id: receiverAccount.id }, transaction },
      );

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw new HttpException(400, 'Houve um problema ao realizar a transação');
    }
  }
}

export default TransactionService;
