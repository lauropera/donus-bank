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
import { invalidLoginMocks, loginMock, userMock } from '../mocks/userMock';

const { app } = new App();

describe('Integration tests for POST "/auth/login"', () => {
  let chaiHttpResponse: Response;

  after(() => sinon.restore());

  describe('With success', () => {
    it('Returns the status 200 (OK) and a token', async () => {
      sinon.stub(User, 'findOne').resolves(userMock as User);
      sinon.stub(jwt, 'sign').resolves('generatedToken');

      chaiHttpResponse = await request(app).post('/auth/login').send(loginMock);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
      expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  describe('With failure', () => {
    afterEach(() => sinon.restore());

    it('Returns the status 400 (BAD_REQUEST) if the email is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({ message: 'Email inválido' });
    });

    it('Returns the status 400 (BAD_REQUEST) if the password was not send', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Campos obrigatórios faltando',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if the requisition body is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Corpo de requisição inválido',
      });
    });

    it('Returns the status 401 (UNAUTHORIZED) if the email is not signed up', async () => {
      sinon.stub(User, 'findOne').resolves(undefined);

      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.UNAUTHORIZED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email não cadastrado',
      });
    });

    it('Returns the status 401 (UNAUTHORIZED) if the password is wrong', async () => {
      sinon.stub(User, 'findOne').resolves(userMock as User);

      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.UNAUTHORIZED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email ou senha inválidos',
      });
    });
  });
});
