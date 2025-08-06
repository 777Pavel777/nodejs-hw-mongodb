import createHttpError from 'http-errors';
import { verifyToken } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Authorization header missing or invalid');
  }
  try {
    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateWithCookie = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log(`Refresh token missing in cookies for: ${req.originalUrl}`);
    throw createHttpError(401, 'Refresh token missing in cookies');
  }
  try {
    const session = await session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
    if (session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Refresh token expired');
    }
    const user = await user.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};
