/* eslint-disable @typescript-eslint/naming-convention */
import joi from 'joi';
import validator from 'cpf-cnpj-validator';

const Joi = joi.extend(validator);

const REQUIRED_MSG = 'Campos obrigatórios faltando';
const EMAIL_MSG = 'Email inválido';
const MIN_MSG = 'O valor mínimo exigido é de R$0,01';
const INVALID_BODY_MSG = 'Corpo de requisição inválido';

const nameSchema = Joi.string().min(2).required().messages({
  'any.required': REQUIRED_MSG,
  'string.empty': REQUIRED_MSG,
  'string.min': 'O nome precisa ter no mínimo 2 caracteres',
});

const emailSchema = Joi.string().email().required().messages({
  'any.required': REQUIRED_MSG,
  'string.empty': REQUIRED_MSG,
  'string.email': EMAIL_MSG,
});

const cpfSchema = Joi.document().cpf().required().messages({
  'any.required': REQUIRED_MSG,
});

const passwordSchema = Joi.string().min(4).required().messages({
  'any.required': REQUIRED_MSG,
  'string.empty': REQUIRED_MSG,
  'string.min': 'A senha precisa ter no mínimo 4 caracteres',
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
}).messages({
  'object.unknown': INVALID_BODY_MSG,
});

export const registerSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  password: passwordSchema,
}).messages({
  'object.unknown': INVALID_BODY_MSG,
});

export const transactionSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': EMAIL_MSG,
  }),
  cpf: Joi.document().cpf().messages({
    'string.cpf': 'CPF inválido',
  }),
  value: Joi.number().min(0.01).required()
    .messages({
      'any.required': REQUIRED_MSG,
      'number.min': MIN_MSG,
    }),
}).messages({
  'object.unknown': INVALID_BODY_MSG,
});

export const depositSchema = Joi.object({
  value: Joi.number().min(0.01).max(2000).required()
    .messages({
      'any.required': REQUIRED_MSG,
      'number.min': MIN_MSG,
      'number.max': 'O valor máximo de depósito permitido é de R$2000,00',
    }),
});
