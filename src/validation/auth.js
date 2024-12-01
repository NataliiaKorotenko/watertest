import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

// signup
export const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

// signin
export const authLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authRequestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const authResetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
