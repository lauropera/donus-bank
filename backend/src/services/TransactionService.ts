import { Op } from 'sequelize';
import db from '../database/models';
import Token from './utils/TokenUtils';
import HttpException from '../utils/HttpException';
import { depositSchema, transactionSchema } from './utils/validations/schemas';
import User from '../database/models/User';
import Transaction from '../database/models/Transaction';
import TransactionType from '../database/models/TransactionType';
import Account from '../database/models/Account';
import IDateFilter from '../interfaces/IDateFilter';
import ITransaction, {
  ITransactionCreation,
  ITransactionDeposit,
  TransactionFilter,
  TransactionMethod,
} from '../interfaces/ITransaction';

const DEPOSIT_TYPE_ID = 1;
const TRANSFER_TYPE_ID = 2;

const setAccountIncludeOptions = (accountUser: string) => ({
  model: Account,
  as: accountUser,
  attributes: { exclude: ['balance'] },
  include: [{ model: User, as: 'user', attributes: ['name'] }],
});

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
    if (filter === 'sent') {
      return {
        [Op.and]: [
          { ownerAccountId: id },
          { [Op.not]: { transactionTypeId: DEPOSIT_TYPE_ID } },
        ],
      };
    }

    if (filter === 'received') return { receiverAccountId: id };

    if (filter === 'date') {
      const starts = dateToFilter?.starts ? dateToFilter?.starts : '0';
      const ends = dateToFilter?.ends ? dateToFilter?.ends : Date.now();
      return {
        createdAt: { [Op.between]: [starts, ends] },
      };
    }

    return { [Op.or]: [{ ownerAccountId: id }, { receiverAccountId: id }] };
  }

  async getAll(
    token: string,
    filterOption: TransactionFilter,
    dateToFilter: IDateFilter | undefined
  ): Promise<ITransaction[]> {
    const { id: userId } = await Token.authenticate(token);

    const filter = TransactionService.setFilter(
      userId,
      filterOption,
      dateToFilter
    );

    const transactions = await this._model.findAll({
      attributes: {
        exclude: ['ownerAccountId', 'receiverAccountId', 'transactionTypeId'],
      },
      include: [
        setAccountIncludeOptions('ownerAccount'),
        setAccountIncludeOptions('receiverAccount'),
        {
          model: TransactionType,
          as: 'transactionType',
          attributes: { exclude: ['id'] },
        },
      ],
      where: { ...filter },
    });

    return transactions;
  }

  async insert(
    token: string,
    transferType: TransactionMethod,
    transactionData: ITransactionCreation
  ): Promise<void> {
    const { id } = await Token.authenticate(token);

    TransactionService.validateTransaction(transactionData);

    const ownerUser = await this._userModel.findByPk(id);
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
          transactionTypeId: TRANSFER_TYPE_ID,
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

  async deposit(token: string, deposit: ITransactionDeposit): Promise<void> {
    const { id } = await Token.authenticate(token);

    const validation = depositSchema.validate(deposit);
    if (validation.error || !deposit.value) {
      throw new HttpException(400, validation.error.message);
    }

    const userAccount = await this._accountModel.findByPk(id);
    if (!userAccount) throw new HttpException(404, 'Conta não encontrada');

    const transaction = await db.transaction();
    try {
      await this._model.create(
        {
          ownerAccountId: id,
          receiverAccountId: id,
          transactionTypeId: DEPOSIT_TYPE_ID,
          value: deposit.value,
        },
        { transaction }
      );

      await this._accountModel.update(
        { balance: userAccount.balance + deposit.value },
        { where: { id }, transaction }
      );

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw new HttpException(400, 'Houve um problema ao realizar a transação');
    }
  }
}

export default TransactionService;
