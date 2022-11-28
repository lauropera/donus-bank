import joi from 'joi';
import validator from 'cpf-cnpj-validator';

const Joi = joi.extend(validator);

export const loginSchema = Joi.object({
  cpf: Joi.document().cpf().required(),
  password: Joi.string().min(4).required(),
});
