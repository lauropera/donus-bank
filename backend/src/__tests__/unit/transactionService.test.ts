import * as chai from 'chai';
import * as sinon from 'sinon';
import jwt from 'jsonwebtoken';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const { expect } = chai;

import { StatusCodes } from 'http-status-codes';
import HttpException from '../../utils/HttpException';
import { TransactionService, UserService } from '../../services';
import User from '../../database/models/User';
import Transaction from '../../database/models/Transaction';
import db from '../../database/models';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { IRegister } from '../../interfaces';
import {
  invalidLoginMocks,
  loginMock,
  newUserMock,
  newUserMock2,
  newUserResponseMock,
  userMock,
} from '../mocks/userMock';
import Account from '../../database/models/Account';
import { accountMock, newAccountResponseMock } from '../mocks/accountMock';
import {
  invalidNewTransactionMocks,
  newDepositMock,
} from '../mocks/transactionsMock';
import { ITransactionCreation } from '../../interfaces/ITransaction';

const TOKEN_MOCK = 'token';

describe('Testes unitários de TransactionService', () => {
  let transactionService: TransactionService;

  before(() => {
    transactionService = new TransactionService();
  });

  describe('Deposit', () => {
    after(() => sinon.restore());

    describe('Com sucesso', () => {
      it('Faz um depósito com sucesso', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 2 });
        sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
        sinon.stub(db, 'transaction').resolves({
          async commit() {},
          async rollback() {},
        } as SequelizeTransaction);
        sinon.stub(Transaction, 'create').resolves();
        sinon.stub(Account, 'update').resolves([1]);

        const result = await transactionService.deposit(
          TOKEN_MOCK,
          newDepositMock
        );

        expect(result).to.be.eq(1);
      });
    });

    describe('Com falhas', () => {
      afterEach(() => sinon.restore());

      it('Retorna um erro de status 400 e mensagem "Campos obrigatórios faltando"', async () => {
        try {
          await transactionService.deposit(
            TOKEN_MOCK,
            {} as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Campos obrigatórios faltando');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Retorna um erro de status 400 e mensagem "O valor mínimo exigido é de R$0,01"', async () => {
        try {
          await transactionService.deposit(TOKEN_MOCK, { value: 0 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('O valor mínimo exigido é de R$0,01');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Retorna um erro de status 400 e mensagem "O valor máximo de depósito permitido é de R$2000,00"', async () => {
        try {
          await transactionService.deposit(TOKEN_MOCK, { value: 2050 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'O valor máximo de depósito permitido é de R$2000,00'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Retorna um erro de status 400 e mensagem "Token inválido"', async () => {
        sinon.stub(jwt, 'verify').resolves(undefined);

        try {
          await transactionService.deposit('invalidToken', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Token inválido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Retorna um erro de status 404 e mensagem "Token inválido"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(Account, 'findByPk').resolves(undefined);

        try {
          await transactionService.deposit('token', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Conta não encontrada');
            expect(err.status).to.be.eq(StatusCodes.NOT_FOUND);
          }
        }
      });

      it('Retorna um erro de status 400 e mensagem "Houve um problema ao realizar a transação"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
        sinon.stub(Transaction, 'create').rejects();
        sinon.stub(Account, 'update').rejects();

        try {
          await transactionService.deposit('token', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Houve um problema ao realizar a transação'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });
    });
  });
});
