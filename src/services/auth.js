import process from 'process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { v4 as uuidv4 } from 'uuid';

const { MONGODB_PASSWORD } = process.env;

if (!MONGODB_PASSWORD) {
  throw new Error('MONGODB_PASSWORD is not defined in environment variables');
}

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw createHttpError(400, 'Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await User.create({ name, email, password: hashedPassword });
  } catch (error) {
    throw createHttpError(500, `Failed to create user: ${error.message}`);
  }

  if (!user) {
    throw createHttpError(500, 'Failed to create user: User object is null');
  }

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userData;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, MONGODB_PASSWORD, {
    expiresIn: '15m',
  });
  const refreshToken = uuidv4();
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = jwt.sign({ userId: session.userId }, MONGODB_PASSWORD, {
    expiresIn: '15m',
  });
  const newRefreshToken = uuidv4();
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  console.log(`Session deleted for refreshToken: ${refreshToken}`);
};

export const verifyToken = async (token) => {
  try {
    if (!token) {
      throw createHttpError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, MONGODB_PASSWORD);
    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createHttpError(401, `Invalid token: ${error.message}`);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw createHttpError(401, 'Access token expired');
    }
    throw createHttpError(401, error.message || 'Authentication failed');
  }
};
