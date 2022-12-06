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

describe('Integration tests for POST "/auth/register"', () => {
  let chaiHttpResponse: Response;

  after(() => sinon.restore());

  describe('With success', () => {
    it('Returns the status 201 (CREATED) and message "Usuário cadastrado com sucesso"', async () => {
      sinon.stub(User, 'findAll').resolves([]);
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

  describe('With failure', () => {
    afterEach(() => sinon.restore());

    it('Returns the status 400 (BAD_REQUEST) if the name length is less than two chars', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[0]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'O nome precisa ter no mínimo 2 caracteres',
      });
    });

    it('Returns the status 409 (CONFLICT) if the email is already signed up', async () => {
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

    it('Returns the status 409 (CONFLICT) if the CPF is already signed up', async () => {
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

    it('Returns the status 400 (BAD_REQUEST) if the email is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[1]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Email inválido',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if the CPF is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[2]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'CPF inválido',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if the password is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[3]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'A senha precisa ter no mínimo 4 caracteres',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if required fields are missing', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[4]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Campos obrigatórios faltando',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if the requisition body is invalid', async () => {
      chaiHttpResponse = await request(app)
        .post('/auth/register')
        .send(invalidNewUserMocks[5]);

      expect(chaiHttpResponse.status).to.be.eq(StatusCodes.BAD_REQUEST);
      expect(chaiHttpResponse.body).to.deep.eq({
        message: 'Corpo de requisição inválido',
      });
    });

    it('Returns the status 400 (BAD_REQUEST) if the sign up method fails', async () => {
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
