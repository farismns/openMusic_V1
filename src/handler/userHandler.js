const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const postUserHandler = async (request, h) => {
  try {
    const { username, password, fullname } = request.payload;

    if (!username || typeof username !== 'string' || username.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal membuat pengguna. Username wajib diisi.',
        })
        .code(400);
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal membuat pengguna. Password wajib diisi.',
        })
        .code(400);
    }

    if (!fullname || typeof fullname !== 'string' || fullname.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal membuat pengguna. Nama lengkap wajib diisi.',
        })
        .code(400);
    }

    const isTaken = await UserModel.isUsernameTaken(username);
    if (isTaken) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal membuat pengguna. Username sudah digunakan.',
        })
        .code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await UserModel.addUser({
      username: username.trim(),
      password: hashedPassword,
      fullname: fullname.trim(),
    });

    return h
      .response({
        status: 'success',
        data: { userId },
      })
      .code(201);
  } catch (error) {
    console.error('Error in postUserHandler:', error);

    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server.',
      })
      .code(500);
  }
};

module.exports = { postUserHandler };
