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
    cpf: '12312312345'
  },
  {
    email: loginMock.email,
    password: 'queroquero',
  }
];

export const userMock = {
  id: 1,
  name: 'Mallu Magalhães',
  email: loginMock.email,
  cpf: cpf.generate(),
  password: bcrypt.hashSync(loginMock.password, 8),
  accountId: 1,
};
