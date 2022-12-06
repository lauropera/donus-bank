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

describe('Integration tests for POST "/transactions/deposit"', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Returns the status 200 (OK) and message "Depósito realizado com sucesso"', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon.stub(Account, 'findByPk').resolves(accountMock as Account);
    sinon.stub(Transaction, 'create').resolves();
    sinon.stub(Account, 'update').resolves([1]);
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

  it('Returns the status 404 (NOT_FOUND) if the account was not found', async () => {
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

  it('Returns the status 400 (BAD_REQUEST) if the deposit fails', async () => {
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
