import * as chai from 'chai';
import * as sinon from 'sinon';
import jwt from 'jsonwebtoken';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const { expect } = chai;

import { StatusCodes } from 'http-status-codes';
import HttpException from '../../utils/HttpException';
import { TransactionService } from '../../services';

import User from '../../database/models/User';
import Account from '../../database/models/Account';
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

import { accountMock, newAccountResponseMock } from '../mocks/accountMock';
import {
  invalidNewTransactionMocks,
  newDepositMock,
  newTransactionMocks,
  newTransactionResponseMock,
} from '../mocks/transactionsMock';
import { ITransactionCreation } from '../../interfaces/ITransaction';

const TOKEN_MOCK = 'token';

describe('Unit tests from TransactionService', () => {
  const transactionService = new TransactionService();

  describe('Insert', () => {
    after(() => sinon.restore());

    describe('With sucess', () => {
      it('The transaction goes successfully', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);

        sinon
          .stub(Account, 'findByPk')
          .onFirstCall()
          .resolves(accountMock as Account)
          .onSecondCall()
          .resolves(newAccountResponseMock as Account);

        sinon.stub(db, 'transaction').resolves({
          async commit() {},
          async rollback() {},
        } as SequelizeTransaction);

        sinon
          .stub(Transaction, 'create')
          .resolves(newTransactionResponseMock as unknown as Transaction);

        sinon.stub(Account, 'update').resolves();

        const result = await transactionService.insert(
          'token',
          'email',
          newTransactionMocks[0] as ITransactionCreation
        );

        expect(result).to.deep.eq(newTransactionResponseMock);
      });
    });

    describe('With failure', () => {
      afterEach(() => sinon.restore());

      it('Returns a status error 400 with message "Campos obrigat??rios faltando"', async () => {
        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            {} as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Campos obrigat??rios faltando');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "Email inv??lido"', async () => {
        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            invalidNewTransactionMocks[0] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email inv??lido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "CPF inv??lido"', async () => {
        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'cpf',
            invalidNewTransactionMocks[1] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('CPF inv??lido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "O valor m??nimo exigido ?? de R$0,01"', async () => {
        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            invalidNewTransactionMocks[2] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('O valor m??nimo exigido ?? de R$0,01');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "Token inv??lido"', async () => {
        sinon.stub(jwt, 'verify').resolves(undefined);

        try {
          await transactionService.insert(
            'invalidToken',
            'email',
            newTransactionMocks[0] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Token inv??lido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 404 with message "Conta destinat??ria n??o existente, verifique o Email"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(undefined);

        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            newTransactionMocks[0] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Conta destinat??ria n??o existente, verifique o Email'
            );
            expect(err.status).to.be.eq(StatusCodes.NOT_FOUND);
          }
        }
      });

      it('Returns a status error 404 with message "Conta destinat??ria n??o existente, verifique o CPF"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(undefined);

        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'cpf',
            newTransactionMocks[1] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Conta destinat??ria n??o existente, verifique o CPF'
            );
            expect(err.status).to.be.eq(StatusCodes.NOT_FOUND);
          }
        }
      });

      it('Returns a status error 422 with message "N??o ?? poss??vel fazer uma transfer??ncia para si mesmo"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(Account, 'findByPk').resolves(accountMock as Account);

        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'cpf',
            newTransactionMocks[1] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'N??o ?? poss??vel fazer uma transfer??ncia para si mesmo'
            );
            expect(err.status).to.be.eq(StatusCodes.UNPROCESSABLE_ENTITY);
          }
        }
      });

      it('Returns a status error 422 with message "Voc?? n??o tem saldo suficiente"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);

        sinon
          .stub(Account, 'findByPk')
          .onFirstCall()
          .resolves(accountMock as Account)
          .onSecondCall()
          .resolves(newAccountResponseMock as Account);

        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            newTransactionMocks[2] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Voc?? n??o tem saldo suficiente');
            expect(err.status).to.be.eq(StatusCodes.UNPROCESSABLE_ENTITY);
          }
        }
      });

      it('Returns a status error 400 with message "Houve um problema ao realizar a transa????o"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findByPk').resolves(userMock as User);
        sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);

        sinon
          .stub(Account, 'findByPk')
          .onFirstCall()
          .resolves(accountMock as Account)
          .onSecondCall()
          .resolves(newAccountResponseMock as Account);

        sinon.stub(Transaction, 'create').rejects();

        try {
          await transactionService.insert(
            TOKEN_MOCK,
            'email',
            newTransactionMocks[0] as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Houve um problema ao realizar a transa????o'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });
    });
  });

  describe('Deposit', () => {
    after(() => sinon.restore());

    describe('With sucess', () => {
      it('The deposit goes successfully', async () => {
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

    describe('With failure', () => {
      afterEach(() => sinon.restore());

      it('Returns a status error 400 with message "Campos obrigat??rios faltando"', async () => {
        try {
          await transactionService.deposit(
            TOKEN_MOCK,
            {} as ITransactionCreation
          );
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Campos obrigat??rios faltando');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "O valor m??nimo exigido ?? de R$0,01"', async () => {
        try {
          await transactionService.deposit(TOKEN_MOCK, { value: 0 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('O valor m??nimo exigido ?? de R$0,01');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "O valor m??ximo de dep??sito permitido ?? de R$2000,00"', async () => {
        try {
          await transactionService.deposit(TOKEN_MOCK, { value: 2050 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'O valor m??ximo de dep??sito permitido ?? de R$2000,00'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "Token inv??lido"', async () => {
        sinon.stub(jwt, 'verify').resolves(undefined);

        try {
          await transactionService.deposit('invalidToken', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Token inv??lido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 404 with message "Token inv??lido"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(Account, 'findByPk').resolves(undefined);

        try {
          await transactionService.deposit('token', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Conta n??o encontrada');
            expect(err.status).to.be.eq(StatusCodes.NOT_FOUND);
          }
        }
      });

      it('Returns a status error 400 with message "Houve um problema ao realizar a transa????o"', async () => {
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
        sinon.stub(Transaction, 'create').rejects();
        sinon.stub(Account, 'update').rejects();

        try {
          await transactionService.deposit('token', { value: 100 });
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Houve um problema ao realizar a transa????o'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });
    });
  });
});
