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

describe('Testes de integração endpoint POST "/auth/login"', () => {
  let chaiHttpResponse: Response;

  after(() => sinon.restore());

  describe('Com sucesso', () => {
    it('Retorna um token e status 200 (OK)', async () => {
      sinon.stub(User, 'findOne').resolves(userMock as User);
      sinon.stub(jwt, 'sign').resolves('generatedToken');

      chaiHttpResponse = await request(app).post('/auth/login').send(loginMock);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.OK);
      expect(chaiHttpResponse.body).to.have.property('token');
    });
  });

  describe('Com falhas', () => {
    afterEach(() => sinon.restore());

    it('Retorna status 400 (BAD_REQUEST) se o email for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({ message: 'Email inválido' });
    });

    it('Retorna status 400 (BAD_REQUEST) se a senha não for passada', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Campos obrigatórios faltando',
      });
    });

    it('Retorna status 400 (BAD_REQUEST) se o corpo da requisição for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Corpo de requisição inválido',
      });
    });

    it('Retorna o status 401 (UNAUTHORIZED) se o email não for cadastrado', async () => {
      sinon.stub(User, 'findOne').resolves(undefined);

      chaiHttpResponse = await request(app)
        .post('/auth/login')
        .send(invalidLoginMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.UNAUTHORIZED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email não cadastrado',
      });
    });

    it('Retorna o status 401 (UNAUTHORIZED) se a senha for incorreta', async () => {
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
