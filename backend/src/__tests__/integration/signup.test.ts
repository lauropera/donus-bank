import * as sinon from 'sinon';
import { expect, request, use } from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../app';
import User from '../../database/models/User';
import Account from '../../database/models/Account';
import db from '../../database/models';

import { Response } from 'superagent';

use(chaiHttp);

import { StatusCodes } from 'http-status-codes';
import { Transaction as SequelizeTransaction } from 'sequelize/types';
import { newAccountResponseMock } from '../mocks/accountMock';
import {
  invalidNewUserMocks,
  newUserMock,
  newUserMock2,
  newUserResponseMock,
} from '../mocks/userMock';

const { app } = new App();

describe('Testes de integração endpoint POST "/auth/register"', () => {
  let chaiHttpResponse: Response;

  after(() => sinon.restore());

  describe('Com sucesso', () => {
    it('Retorna o status 201 (CREATED) e a mensagem "Usuário cadastrado com sucesso"', async () => {
      sinon.stub(User, 'findOne').resolves(undefined);
      sinon.stub(Account, 'create').resolves(newAccountResponseMock as Account);
      sinon.stub(User, 'create').resolves(newUserResponseMock as User);
      sinon.stub(db, 'transaction').resolves({
        async commit() {},
        async rollback() {},
      } as SequelizeTransaction);

      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(newUserMock);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CREATED);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Usuário cadastrado com sucesso',
      });
    });
  });

  describe('Com falhas', () => {
    afterEach(() => sinon.restore());

    it('Retorna o status 400 (BAD_REQUEST) se o nome tiver menos de 2 caracteres', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'O nome precisa ter no mínimo 2 caracteres',
      });
    });

    it('Retorna o status 409 (CONFLICT) se o email já for cadastrado', async () => {
      sinon
        .stub(User, 'findAll')
        .resolves([{ dataValues: { ...newUserResponseMock } }] as User[]);

      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(newUserMock);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CONFLICT);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email já cadastrado',
      });
    });

    it('Retorna o status 409 (CONFLICT) se o CPF já for cadastrado', async () => {
      sinon
        .stub(User, 'findAll')
        .resolves([{ dataValues: { ...newUserResponseMock } }] as User[]);

      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(newUserMock2);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.CONFLICT);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'CPF já cadastrado',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o email for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email inválido',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o CPF for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'CPF inválido',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se a senha for inválida', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'A senha precisa ter no mínimo 4 caracteres',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se campos obrigatórios faltarem', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[4]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Campos obrigatórios faltando',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o corpo da requisição for inválido', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[5]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Corpo de requisição inválido',
      });
    });

    it('Retorna o status 400 (BAD_REQUEST) se o registro falhar', async () => {
      sinon.stub(User, 'findAll').resolves([]);
      sinon.stub(db, 'transaction').rejects({
        async commit() {},
      } as SequelizeTransaction).resolves({
        async rollback() {},
      } as SequelizeTransaction);

      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(newUserMock);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Houve um problema ao cadastrar o usuário',
      });
    });
  });
});
