/* eslint-disable @typescript-eslint/naming-convention */
import joi from 'joi';
import validator from 'cpf-cnpj-validator';

const Joi = joi.extend(validator);

const REQUIRED_MSG = 'Campos obrigatórios faltando';

const nameSchema = Joi.string().min(2).required().messages({
  'any.required': REQUIRED_MSG,
  'string.min': 'O nome precisa ter no mínimo 2 caracteres',
});

const emailSchema = Joi.string().email().required().messages({
  'any.required': REQUIRED_MSG,
  'string.email': 'Email inválido',
});

const cpfSchema = Joi.document().cpf().required().messages({
  'any.required': REQUIRED_MSG,
});

const passwordSchema = Joi.string().min(4).required().messages({
  'any.required': REQUIRED_MSG,
  'string.min': 'A senha precisa ter no mínimo 4 caracteres',
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  password: passwordSchema,
});

export const transactionSchema = Joi.object({
  receiverAccountId: Joi.number().required().messages({
    'any.required': REQUIRED_MSG,
  }),
  value: Joi.number().min(0.01).max(2000).required()
    .messages({
      'any.required': REQUIRED_MSG,
      'number.min': 'O valor mínimo exigido é de R$0,01',
      'number.max': 'O valor máximo permitido é de R$2000,00',
    }),
});
