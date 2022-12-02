import * as bcrypt from 'bcryptjs';
import { cpf } from "cpf-cnpj-validator";

export const loginMock = {
  email: 'mallu@artist.com',
  password: 'sambinhabom',
}

export const invalidLoginMock = {
  email: '',
  password: loginMock.password,
}

export const userMock = {
  id: 1,
  name: 'Mallu Magalhães',
  email: loginMock.email,
  cpf: cpf.generate(),
  password: bcrypt.hashSync(loginMock.password, 8),
  accountId: 1,
}
