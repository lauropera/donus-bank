/* eslint-disable @typescript-eslint/naming-convention */
import joi from 'joi';
import validator from 'cpf-cnpj-validator';

const Joi = joi.extend(validator);

const REQUIRED_MSG = 'Campos obrigatórios faltando';

const nameSchema = Joi.string().min(2).required().messages({
  'any.required': REQUIRED_MSG,
  'string.min': 'O nome precisa ter no mínimo 2 caracteres',
});

const cpfSchema = Joi.document().cpf().required().messages({
  'any.required': REQUIRED_MSG,
});

const passwordSchema = Joi.string().min(4).required().messages({
  'any.required': REQUIRED_MSG,
  'string.min': 'A senha precisa ter no mínimo 4 caracteres',
});

export const loginSchema = Joi.object({
  cpf: cpfSchema,
  password: passwordSchema,
});

export const registerSchema = Joi.object({
  name: nameSchema,
  cpf: cpfSchema,
  password: passwordSchema,
});
