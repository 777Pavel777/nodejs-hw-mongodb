import createHttpError from 'http-errors';
import { verifyToken } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Authorization header missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
