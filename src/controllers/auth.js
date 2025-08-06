import process from 'process';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

export const register = async (req, res, next) => {
  try {
    const userData = await registerUser(req.body);
    console.log('Register response:', userData);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const tokens = await loginUser(req.body);
    console.log('Login response:', tokens);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const tokens = await refreshSession(req.session.refreshToken);
    console.log('Refresh response:', tokens);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.session.refreshToken);
    console.log('Logout successful');
    res.clearCookie('refreshToken');
    res.status(200).json({
      status: 200,
      message: 'Successfully logged out!',
    });
  } catch (error) {
    next(error);
  }
};
