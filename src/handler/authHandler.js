const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const AuthModel = require('../models/AuthModel');
const TokenManager = require('../utils/tokenManager');

const postAuthHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;

    if (!username || !password) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal melakukan autentikasi. Username dan password wajib diisi.',
        })
        .code(400);
    }

    const user = await UserModel.getPasswordByUsername(username);
    if (!user) {
      return h
        .response({
          status: 'fail',
          message: 'Kredensial yang Anda masukkan tidak valid.',
        })
        .code(401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return h
        .response({
          status: 'fail',
          message: 'Kredensial yang Anda masukkan tidak valid.',
        })
        .code(401);
    }

    const accessToken = TokenManager.generateAccessToken({ userId: user.id });
    const refreshToken = TokenManager.generateRefreshToken({ userId: user.id });

    await AuthModel.addRefreshToken(refreshToken, user.id);

    return h
      .response({
        status: 'success',
        data: { accessToken, refreshToken },
      })
      .code(201);
  } catch (error) {
    console.error('Error in postAuthHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server.',
      })
      .code(500);
  }
};

const putAuthHandler = async (request, h) => {
  try {
    const { refreshToken } = request.payload;

    if (!refreshToken) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token wajib diisi.',
        })
        .code(400);
    }

    const payload = TokenManager.verifyRefreshTokenSignature(refreshToken);

    if (!payload || !payload.userId) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token tidak valid.',
        })
        .code(400);
    }

    const exists = await AuthModel.verifyRefreshToken(refreshToken);
    if (!exists) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token tidak terdaftar.',
        })
        .code(400);
    }

    const accessToken = TokenManager.generateAccessToken({ userId: payload.userId });

    return h
      .response({
        status: 'success',
        data: { accessToken },
      })
      .code(200);
  } catch (error) {
    console.error('Error in putAuthHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server.',
      })
      .code(500);
  }
};

const deleteAuthHandler = async (request, h) => {
  try {
    const { refreshToken } = request.payload;

    if (!refreshToken) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token wajib diisi.',
        })
        .code(400);
    }

    const payload = TokenManager.verifyRefreshTokenSignature(refreshToken);

    if (!payload || !payload.userId) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token tidak valid.',
        })
        .code(400);
    }

    const exists = await AuthModel.verifyRefreshToken(refreshToken);
    if (!exists) {
      return h
        .response({
          status: 'fail',
          message: 'Refresh token tidak terdaftar.',
        })
        .code(400);
    }

    await AuthModel.deleteRefreshToken(refreshToken);

    return h
      .response({
        status: 'success',
        message: 'Refresh token berhasil dihapus. Anda telah berhasil keluar.',
      })
      .code(200);
  } catch (error) {
    console.error('Error in deleteAuthHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server.',
      })
      .code(500);
  }
};

module.exports = {
  postAuthHandler,
  putAuthHandler,
  deleteAuthHandler,
};
