import createHttpError from 'http-errors';
import { verifyToken } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  console.log(`Authenticate middleware called for: ${req.method} ${req.path}`);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header missing or invalid for:', req.path);
    throw createHttpError(401, 'Authorization header missing or invalid');
  }
  try {
    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    req.user = user;
    console.log(`User authenticated for ${req.path}:`, user.email);
    next();
  } catch (error) {
    console.error(`Authentication error for ${req.path}:`, error.message);
    next(error);
  }
};
