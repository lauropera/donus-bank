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

describe('Integration tests for GET "/auth/me"', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Returns the status 200 (OK) and the user data', async () => {
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

  it('Returns the status 404 (NOT_FOUND) if the user was not found in database', async () => {
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

  it('Returns the status 400 (BAD_REQUEST) if the token is invalid', async () => {
    chaiHttpResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', 'invalidtoken');

    expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
    expect(chaiHttpResponse.body).to.deep.eq({
      message: 'Token inválido',
    });
  });
});
