import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const router = express.Router();

router.post(
  '/auth/register',
  validateBody(registerSchema),
  ctrlWrapper(register),
);
router.post('/auth/login', validateBody(loginSchema), ctrlWrapper(login));

router.post('/auth/refresh', authenticate, ctrlWrapper(refresh));
router.post('/auth/logout', authenticate, ctrlWrapper(logout));

export default router;
