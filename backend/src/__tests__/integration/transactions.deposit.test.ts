import * as sinon from 'sinon';
import { expect, request, use } from 'chai';
import jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../app';
import Account from '../../database/models/Account';
import Transaction from '../../database/models/Transaction';
import db from '../../database/models';

import { Response } from 'superagent';

use(chaiHttp);

import { StatusCodes } from 'http-status-codes';
import { Transaction as SequelizeTransaction } from 'sequelize/types';
import { accountMock } from '../mocks/accountMock';
import { newDepositMock } from '../mocks/transactionsMock';

const { app } = new App();

describe('Testes de integração endpoint POST "/transactions/deposit"', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Retorna o status 200 (OK) e a mensagem "Depósito realizado com sucesso"', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
    sinon.stub(Transaction, 'create').resolves();
    sinon.stub(Account, 'update').resolves();
    sinon.stub(db, 'transaction').resolves({
      async commit() {},
      async rollback() {},
    } as SequelizeTransaction);

    chaiHttpResponse = await request(app)
      .post('/transactions/deposit')
      .send(newDepositMock)
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CREATED);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Depósito realizado com sucesso',
    });
  });

  it('Retorna o status 404 (NOT_FOUND) se a conta não for encontrada', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon.stub(Account, 'findByPk').resolves(undefined);

    chaiHttpResponse = await request(app)
      .post('/transactions/deposit')
      .send(newDepositMock)
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Conta não encontrada',
    });
  });

  it('Retorna o status 400 (BAD_REQUEST) caso o deposito falhe', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
    sinon
      .stub(db, 'transaction')
      .rejects({
        async commit() {},
      } as SequelizeTransaction)
      .resolves({
        async rollback() {},
      } as SequelizeTransaction);

    chaiHttpResponse = await request(app)
      .post('/transactions/deposit')
      .send(newDepositMock)
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Houve um problema ao realizar a transação',
    });
  });
});
