import * as sinon from 'sinon';
import { expect, request, use } from 'chai';
import jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../app';
import User from '../../database/models/User';
import Account from '../../database/models/Account';
import Transaction from '../../database/models/Transaction';
import db from '../../database/models';

import { Response } from 'superagent';

use(chaiHttp);

import { StatusCodes } from 'http-status-codes';
import { Transaction as SequelizeTransaction } from 'sequelize/types';
import {
  invalidNewTransactionMocks,
  newTransactionMocks,
} from '../mocks/transactionsMock';
import { newUserResponseMock, userMock } from '../mocks/userMock';
import { accountMock, newAccountResponseMock } from '../mocks/accountMock';

const { app } = new App();

describe('Testes de integração endpoint POST "/transactions/new"', () => {
  let chaiHttpResponse: Response;

  after(() => sinon.restore());

  describe('Com sucesso', () => {
    afterEach(() => sinon.restore());

    it('Retorna o status 201 (CREATED) com uma transação por email e a mensagem "Transação realizada com sucesso"', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);
      sinon
        .stub(Account, 'findOne')
        .onFirstCall()
        .resolves(accountMock as Account)
        .onSecondCall()
        .resolves(newAccountResponseMock as Account);
      sinon.stub(Transaction, 'create').resolves();
      sinon
        .stub(Account, 'update')
        .onFirstCall()
        .resolves()
        .onSecondCall()
        .resolves();
      sinon.stub(db, 'transaction').resolves({
        async commit() {},
        async rollback() {},
      } as SequelizeTransaction);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(newTransactionMocks[0])
        .set('Authorization', 'fictoken');

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CREATED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Transação realizada com sucesso',
      });
    });

    it('Retorna o status 201 (CREATED) com uma transação por CPF e a mensagem "Transação realizada com sucesso"', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);
      sinon
        .stub(Account, 'findOne')
        .onFirstCall()
        .resolves(accountMock as Account)
        .onSecondCall()
        .resolves(newAccountResponseMock as Account);
      sinon.stub(Transaction, 'create').resolves();
      sinon
        .stub(Account, 'update')
        .onFirstCall()
        .resolves()
        .onSecondCall()
        .resolves();
      sinon.stub(db, 'transaction').resolves({
        async commit() {},
        async rollback() {},
      } as SequelizeTransaction);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=cpf')
        .send(newTransactionMocks[1])
        .set('Authorization', 'fictoken');

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CREATED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Transação realizada com sucesso',
      });
    });
  });

  describe('Com falhas', () => {
    afterEach(() => sinon.restore());

    it('Retorna o status 400 (BAD_REQUEST) se o email for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(invalidNewTransactionMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({ message: 'Email inválido' });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o CPF for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=cpf')
        .send(invalidNewTransactionMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({ message: 'CPF inválido' });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o valor for menor que 0.01', async () => {
      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(invalidNewTransactionMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'O valor mínimo exigido é de R$0,01',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se faltarem campos', async () => {
      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(invalidNewTransactionMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Campos obrigatórios faltando',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o corpo da requisição for inválido', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(invalidNewTransactionMocks[4]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Corpo de requisição inválido',
      });
    });

    it('Retorna o status 404 (NOT_FOUND) se o email destinatário não for encontrado', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(undefined);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?transferType=email')
        .send(newTransactionMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.NOT_FOUND);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Conta destinatária não existente, verifique o Email',
      });
    });

    it('Retorna o status 404 (NOT_FOUND) se o CPF destinatário não for encontrado', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(undefined);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?transferType=cpf')
        .send(newTransactionMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.NOT_FOUND);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Conta destinatária não existente, verifique o CPF',
      });
    });

    it('Retorna o status 422 (UNPROCESSABLE_ENTITY) se a transação for para a mesma conta', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(newUserResponseMock as User);
      sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);
      sinon
        .stub(Account, 'findByPk')
        .onFirstCall()
        .resolves(newAccountResponseMock as Account)
        .onSecondCall()
        .resolves(newAccountResponseMock as Account);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(newTransactionMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(
        StatusCodes.UNPROCESSABLE_ENTITY
      );
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Não é possível fazer uma transferência para si mesmo',
      });
    });

    it('Retorna o status 422 (UNPROCESSABLE_ENTITY) se não tiver saldo suficiente', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);
      sinon
        .stub(Account, 'findByPk')
        .onFirstCall()
        .resolves(accountMock as Account)
        .onSecondCall()
        .resolves(newAccountResponseMock as Account);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(newTransactionMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(
        StatusCodes.UNPROCESSABLE_ENTITY
      );
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Você não tem saldo suficiente',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se a transação falhar', async () => {
      sinon.stub(jwt, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findByPk').resolves(userMock as User);
      sinon.stub(User, 'findOne').resolves(newUserResponseMock as User);
      sinon
        .stub(db, 'transaction')
        .rejects({
          async commit() {},
        } as SequelizeTransaction)
        .resolves({
          async rollback() {},
        } as SequelizeTransaction);

      chaiHttpResponse = await request(app)
        .post('/transactions/new?type=email')
        .send(newTransactionMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Houve um problema ao realizar a transação',
      });
    });
  });
});
