import * as chai from 'chai';
import * as sinon from 'sinon';
import jwt from 'jsonwebtoken';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const { expect } = chai;

import { StatusCodes } from 'http-status-codes';
import HttpException from '../../utils/HttpException';
import { UserService } from '../../services';
import User from '../../database/models/User';
import db from '../../database/models';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { IRegister } from '../../interfaces';
import {
  invalidLoginMocks,
  loginMock,
  newUserMock,
  newUserMock2,
  newUserResponseMock,
  userMock,
} from '../mocks/userMock';
import Account from '../../database/models/Account';
import { newAccountResponseMock } from '../mocks/accountMock';

describe('Unit tests from UserService', () => {
  let userService: UserService;

  before(() => {
    userService = new UserService();
  });

  describe('Login', () => {
    after(() => sinon.restore());

    describe('With sucess', () => {
      it('Returns the token', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(jwt, 'sign').resolves('token');

        const result = await userService.login(loginMock);
        expect(result).to.be.eq('token');
      });
    });

    describe('With failure', () => {
      afterEach(() => sinon.restore());
      it('Returns a status error 400 with message "Email inválido"', async () => {
        try {
          await userService.login(invalidLoginMocks[0]);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email inválido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "A senha precisa ter no mínimo 4 caracteres"', async () => {
        try {
          await userService.login(invalidLoginMocks[4]);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'A senha precisa ter no mínimo 4 caracteres'
            );
            expect(err.status).to.be.eq(400);
          }
        }
      });

      it('Returns a status error 401 with message "Email não cadastrado"', async () => {
        sinon.stub(User, 'findOne').resolves(undefined);

        try {
          await userService.login(loginMock);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email não cadastrado');
            expect(err.status).to.be.eq(StatusCodes.UNAUTHORIZED);
          }
        }
      });

      it('Returns a status error 401 with message "Email ou senha inválidos"', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);

        try {
          await userService.login(invalidLoginMocks[3]);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email ou senha inválidos');
            expect(err.status).to.be.eq(StatusCodes.UNAUTHORIZED);
          }
        }
      });
    });
  });

  describe('Register', () => {
    after(() => sinon.restore());

    describe('With sucess', () => {
      it('User was signed up successfully', async () => {
        sinon.stub(User, 'findAll').resolves([]);
        sinon.stub(db, 'transaction').resolves({
          async commit() {},
          async rollback() {},
        } as SequelizeTransaction);
        sinon
          .stub(Account, 'create')
          .resolves(newAccountResponseMock as Account);
        sinon.stub(User, 'create').resolves(newUserResponseMock as User);

        const result = await userService.register(newUserMock);

        expect(result).to.deep.eq(newUserResponseMock);
      });
    });

    describe('With failure', () => {
      afterEach(() => sinon.restore());

      it('Returns a status error 400 with message "O nome precisa ter no mínimo 2 caracteres"', async () => {
        const invalidUser = { ...newUserMock, name: 'S' };

        try {
          await userService.register(invalidUser);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'O nome precisa ter no mínimo 2 caracteres'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "Email inválido"', async () => {
        const invalidUser = { ...newUserMock, email: 'sebastianSebs.com' };

        try {
          await userService.register(invalidUser);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email inválido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "CPF inválido"', async () => {
        const invalidUser = { ...newUserMock, cpf: '12312312345' };

        try {
          await userService.register(invalidUser);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('CPF inválido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "A senha precisa ter no mínimo 4 caracteres"', async () => {
        const invalidUser = { ...newUserMock, password: '12' };

        try {
          await userService.register(invalidUser);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'A senha precisa ter no mínimo 4 caracteres'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 400 with message "Campos obrigatórios faltando"', async () => {
        try {
          await userService.register({} as IRegister);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Campos obrigatórios faltando');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 409 with message "Email já cadastrado"', async () => {
        sinon.stub(User, 'findAll').resolves([newUserResponseMock] as User[]);

        try {
          await userService.register(newUserMock);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Email já cadastrado');
            expect(err.status).to.be.eq(StatusCodes.CONFLICT);
          }
        }
      });

      it('Returns a status error 409 with message "CPF já cadastrado"', async () => {
        sinon.stub(User, 'findAll').resolves([newUserResponseMock] as User[]);

        try {
          await userService.register(newUserMock2);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('CPF já cadastrado');
            expect(err.status).to.be.eq(StatusCodes.CONFLICT);
          }
        }
      });

      it('Returns a status error 400 with message "Houve um problema ao cadastrar o usuário"', async () => {
        sinon.stub(User, 'findAll').resolves(undefined);
        sinon
          .stub(db, 'transaction')
          .rejects({
            async commit() {},
          } as SequelizeTransaction)
          .resolves({
            async rollback() {},
          } as SequelizeTransaction);

        try {
          await userService.register(newUserMock2);
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq(
              'Houve um problema ao cadastrar o usuário'
            );
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });
    });
  });

  describe('GetUser', () => {
    describe('With sucess', () => {
      it('Returns the logged user data', async () => {
        sinon.restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findOne').resolves(userMock as User);

        const result = await userService.getUser('token');

        expect(result).to.deep.eq(userMock);
      });
    });

    describe('With failure', () => {
      it('Returns a status error 400 with message "Token inválido"', async () => {
        sinon.restore();
        sinon.stub(jwt, 'verify').resolves(undefined);

        try {
          await userService.getUser('invalidToken');
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Token inválido');
            expect(err.status).to.be.eq(StatusCodes.BAD_REQUEST);
          }
        }
      });

      it('Returns a status error 404 with message "Usuário não encontrado"', async () => {
        sinon.restore();
        sinon.stub(jwt, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findOne').resolves(undefined);

        try {
          await userService.getUser('token');
        } catch (err) {
          if (err instanceof HttpException) {
            expect(err.message).to.be.eq('Usuário não encontrado');
            expect(err.status).to.be.eq(StatusCodes.NOT_FOUND);
          }
        }
      });
    });
  });
});
