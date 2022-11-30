import { Op } from 'sequelize';
import db from '../database/models';
import HttpException from '../utils/HttpException';
import Account, { IAccountCreation } from '../database/models/Account';
import Transaction, {
  ITransaction,
  ITransactionCreation,
  TransactionFilter,
  TransactionType,
} from '../database/models/Transaction';
import { depositSchema, transactionSchema } from './utils/validations/schemas';
import User from '../database/models/User';
import IDateFilter from '../interfaces/IDateFilter';
import Token from './utils/TokenUtils';

class TransactionService {
  private _model = Transaction;
  private _userModel = User;
  private _accountModel = Account;

  private static validateTransaction(data: ITransactionCreation): void {
    const { error } = transactionSchema.validate(data);
    if (error) throw new HttpException(400, error.message);
  }

  private static setFilter(
    id: number,
    filter: TransactionFilter,
    dateToFilter: IDateFilter | undefined
  ): any {
    if (filter === 'sent') return { ownerAccountId: id };
    if (filter === 'received') return { receiverAccountId: id };
    if (filter === 'date') {
      const starts = dateToFilter?.starts ? dateToFilter?.starts : '0';
      const ends = dateToFilter?.ends ? dateToFilter?.ends : Date.now();
      return {
        createdAt: { [Op.between]: [starts, ends] },
      };
    }
  }

  async getAll(
    token: string,
    filterOption: TransactionFilter,
    dateToFilter: IDateFilter | undefined
  ): Promise<ITransaction[]> {
    const authenticated = await Token.authenticate(token);
    const userId = authenticated?.data?.id as number;

    const filter = TransactionService.setFilter(
      userId,
      filterOption,
      dateToFilter
    );

    const transactions = await this._model.findAll({
      attributes: {
        exclude: ['ownerAccountId', 'receiverAccountId'],
      },
      include: [
        { model: Account, as: 'ownerAccount' },
        { model: Account, as: 'receiverAccount' },
      ],
      where: { ...filter },
    });

    return transactions;
  }

  async insert(
    token: string,
    transferType: TransactionType,
    transactionData: ITransactionCreation
  ): Promise<void> {
    const authenticated = await Token.authenticate(token);
    const userId = authenticated?.data?.id as number;

    TransactionService.validateTransaction(transactionData);

    const ownerUser = await this._userModel.findByPk(userId);
    const receiverUser = await this._userModel.findOne({
      where: { [transferType]: transactionData[transferType] },
    });

    const ownerAccount = await this._accountModel.findByPk(
      ownerUser?.accountId
    );
    const receiverAccount = await this._accountModel.findByPk(
      receiverUser?.accountId
    );

    if (!ownerAccount || !receiverAccount) {
      throw new HttpException(
        404,
        `Dados inválidos, verifique se o ${transferType} está correto`
      );
    }

    if (ownerAccount.id === receiverAccount.id) {
      throw new HttpException(
        422,
        'Não é possível fazer uma transferência para si mesmo'
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
        { transaction }
      );

      await this._accountModel.update(
        { balance: ownerAccount.balance - transactionData.value },
        { where: { id: ownerAccount.id }, transaction }
      );

      await this._accountModel.update(
        { balance: receiverAccount.balance + transactionData.value },
        { where: { id: receiverAccount.id }, transaction }
      );

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw new HttpException(400, 'Houve um problema ao realizar a transação');
    }
  }

  async deposit(token: string, quantity: IAccountCreation): Promise<void> {
    const authenticated = await Token.authenticate(token);
    const id = authenticated?.data?.id as number;

    const validation = depositSchema.validate(quantity);
    if (validation.error || !quantity.balance) {
      throw new HttpException(400, validation.error.message);
    }

    const userAccount = await this._accountModel.findByPk(id);
    if (!userAccount) throw new HttpException(404, 'Conta não encontrada');

    await this._accountModel.update(
      { balance: userAccount.balance + quantity.balance },
      { where: { id } }
    );
  }
}

export default TransactionService;
