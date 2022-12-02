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

  it('Retorna o status 200 (OK) e todas as transações do usuário', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações que o usuário enviou', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações que o usuário recebeu', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário a partir de uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário até uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário entre duas datas', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário recebidas a partir de uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário recebidas até uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário enviadas a partir de uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário enviadas até uma data', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário recebidas entre duas datas', async () => {
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

  it('Retorna o status 200 (OK) e todas as transações do usuário enviadas entre duas datas', async () => {
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
