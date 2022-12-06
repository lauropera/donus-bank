import * as sinon from 'sinon';
import { expect, request, use } from 'chai';
import jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../app';
import Transaction from '../../database/models/Transaction';

import { Response } from 'superagent';

use(chaiHttp);

import { StatusCodes } from 'http-status-codes';
import {
  receivedTransactionsMock,
  sentTransactionsMock,
  transactionsAtLeastDateMock,
  transactionsListMock,
  transactionsUntilDateMock,
} from '../mocks/transactionsMock';

const { app } = new App();

describe('Testes de integração do endpoint GET "/transactions/all"', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Returns the status 200 (OK) and all user transactions', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionsListMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=&starts=&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(transactionsListMock);
  });

  it('Returns the status 200 (OK) and all sent user transactions', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(sentTransactionsMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=sent&starts=&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(sentTransactionsMock);
  });

  it('Returns the status 200 (OK) and all received user transactions', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(receivedTransactionsMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=received&starts=&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(receivedTransactionsMock);
  });

  it('Returns the status 200 (OK) and all user transactions from a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionsAtLeastDateMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=&starts=2022-11-01&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(transactionsAtLeastDateMock);
  });

  it('Returns the status 200 (OK) and all user transactions until a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionsUntilDateMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=&starts=&ends=2022-11-25')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(transactionsUntilDateMock);
  });

  it('Returns the status 200 (OK) and all user transactions between two dates', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionsUntilDateMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=&starts=2022-10-01&ends=2022-11-30')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(transactionsUntilDateMock);
  });

  it('Returns the status 200 (OK) and all received user transactions from a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves([
        transactionsListMock[0],
        transactionsListMock[1],
      ] as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=received&starts=2022-11-30&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq([
      transactionsListMock[0],
      transactionsListMock[1],
    ]);
  });

  it('Returns the status 200 (OK) and all received user transactions until a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves([transactionsListMock[2]] as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=received&starts=&ends=2022-11-30')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq([transactionsListMock[2]]);
  });

  it('Returns the status 200 (OK) and all sent user transactions from a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves([transactionsListMock[1]] as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=sent&starts=2022-11-30&ends=')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq([transactionsListMock[1]]);
  });

  it('Returns the status 200 (OK) and all sent user transactions until a date', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves(transactionsUntilDateMock as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=sent&starts=&ends=2022-11-30')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(transactionsUntilDateMock);
  });

  it('Returns the status 200 (OK) and all received user transactions between two dates', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves([transactionsListMock[2]] as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=received&starts=2022-10-10&ends=2022-10-15')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq([transactionsListMock[2]]);
  });

  it('Returns the status 200 (OK) and all sent user transactions between two dates', async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 1 });
    sinon
      .stub(Transaction, 'findAll')
      .resolves([transactionsListMock[1]] as unknown[] as Transaction[]);

    chaiHttpResponse = await request(app)
      .get('/transactions/all?filter=sent&starts=2022-11-30&ends=2022-12-05')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq([transactionsListMock[1]]);
  });
});
