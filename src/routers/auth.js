import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { authenticateWithCookie } from '../middlewares/authenticate.js';
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

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));

router.post(
  '/refresh',
  validateBody(refreshSchema),
  authenticateWithCookie,
  ctrlWrapper(refresh),
);
router.post(
  '/logout',
  validateBody(logoutSchema),
  authenticateWithCookie,
  ctrlWrapper(logout),
);

export default router;
