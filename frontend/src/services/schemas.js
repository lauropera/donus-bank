import * as yup from 'yup';
import { CPF_REGEX } from '../utils/cpfUtils';

const EMAIL_VALIDATION = yup
  .string()
  .email('Email inválido')
  .required('O email é obrigatório');

const CPF_VALIDATION = yup
  .string()
  .matches(CPF_REGEX, 'CPF inválido')
  .required('O CPF é obrigatório');

const PASSWORD_VALIDATION = yup
  .string()
  .min(4, 'No mínimo 4 caracteres')
  .required('A senha é obrigatória');

export const EmailSchema = yup.object().shape({
  email: EMAIL_VALIDATION,
});

export const CPFSchema = yup.object().shape({
  cpf: CPF_VALIDATION,
});

export const SignUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'No mínimo 3 caracteres')
    .max(14, 'Máximo 14 caracteres')
    .required('O nome é obrigatório'),
  lastName: yup
    .string()
    .min(3, 'No mínimo 3 caracteres')
    .required('O sobrenome é obrigatório'),
  cpf: CPF_VALIDATION,
  email: EMAIL_VALIDATION,
  password: PASSWORD_VALIDATION,
});

export const LoginSchema = yup.object().shape({
  email: EMAIL_VALIDATION,
  password: PASSWORD_VALIDATION,
});

export const ValueSchema = yup.object().shape({
  value: yup
    .number()
    .min(0.01, 'O valor mínimo é de R$0,01')
    .required('O valor é obrigatório')
    .typeError('O valor precisa ser um número'),
});

export const transactionSchema = (method) => method.concat(ValueSchema);

export const DepositSchema = yup.object().shape({
  value: yup
    .number()
    .min(0.01, 'O valor mínimo é de R$0,01')
    .max(2000, 'O valor máximo é de R$2000,00')
    .required('O valor é obrigatório')
    .typeError('O valor precisa ser um número'),
});
