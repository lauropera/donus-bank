import * as bcrypt from 'bcryptjs';
import { cpf } from 'cpf-cnpj-validator';

export const loginMock = {
  email: 'mallu@artist.com',
  password: 'sambinhabom',
};

export const invalidLoginMocks = [
  {
    email: 'malluArtist.com',
    password: loginMock.password,
  },
  {
    email: loginMock.email,
    password: '',
  },
  {
    email: loginMock.email,
    password: loginMock.password,
    cpf: '12312312345',
  },
  {
    email: loginMock.email,
    password: 'queroquero',
  },
];

export const userMock = {
  id: 1,
  name: 'Mallu Magalhães',
  email: loginMock.email,
  cpf: cpf.generate(),
  password: bcrypt.hashSync(loginMock.password, 8),
  accountId: 1,
};

export const newUserMock = {
  name: 'Sebastian',
  email: 'sebastian@sebs.com',
  cpf: cpf.generate(),
  password: 'sebslalaland',
};

export const newUserMock2 = {
  name: 'Sebastian',
  email: 'sebastian_sebs@piano.com',
  cpf: newUserMock.cpf,
  password: 'sebslalaland',
};

export const userWithAccountMock = {
  id: userMock.id,
  name: userMock.name,
  email: userMock.email,
  cpf: userMock.cpf,
  account: {
    id: userMock.accountId,
    balance: 100,
  },
};

export const newUserResponseMock = {
  ...newUserMock,
  password: bcrypt.hashSync(newUserMock.password, 8),
  accountId: 2,
};

export const invalidNewUserMocks = [
  {
    name: 'S',
    email: newUserMock.email,
    cpf: newUserMock.cpf,
    password: newUserMock.password,
  },
  {
    name: newUserMock.name,
    email: 'sebastianSebs.com',
    cpf: newUserMock.cpf,
    password: newUserMock.password,
  },
  {
    name: newUserMock.name,
    email: newUserMock.email,
    cpf: '12312312345',
    password: newUserMock.password,
  },
  {
    name: newUserMock.name,
    email: newUserMock.email,
    cpf: newUserMock.cpf,
    password: 'seb',
  },
  {
    name: newUserMock.name,
    cpf: newUserMock.cpf,
    password: 'seb',
  },
  {
    name: newUserMock.name,
    email: newUserMock.email,
    cpf: newUserMock.cpf,
    password: newUserMock.password,
    birthday: '21/07/2002',
  },
];
