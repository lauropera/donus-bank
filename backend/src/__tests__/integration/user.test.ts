import * as sinon from 'sinon';
import { expect, request, use } from 'chai';
import jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../app';
import User from '../../database/models/User';

import { Response } from 'superagent';

use(chaiHttp);

import { StatusCodes } from 'http-status-codes';
import { userWithAccountMock } from '../mocks/userMock';

const { app } = new App();

describe('Testes de integração endpoint GET "/auth/me"', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Retorna o status 200 (OK) e as informações do usuário', async () => {
    sinon
      .stub(User, 'findOne')
      .resolves(userWithAccountMock as unknown as User);
    sinon.stub(jwt, 'verify').resolves({ id: 1 });

    chaiHttpResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.eq(userWithAccountMock);
  });

  it('Retorna o status 404 (NOT_FOUND) se o usuário não for encontrado no banco de dados', async () => {
    sinon.stub(User, 'findOne').resolves(undefined as unknown as User);
    sinon.stub(jwt, 'verify').resolves({ id: 9999 });

    chaiHttpResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', 'fictoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.NOT_FOUND);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Usuário não encontrado',
    });
  });

  it('Retorna o status 400 (BAD_REQUEST) se o token for inválido', async () => {
    chaiHttpResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', 'invalidtoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Token inválido',
    });
  });
});
