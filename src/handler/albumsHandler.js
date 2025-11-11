const AlbumModel = require('../models/AlbumModel');

const postAlbumHandler = async (request, h) => {
  try {
    const { name, year } = request.payload;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan album. Mohon isi nama album dengan benar',
        })
        .code(400);
    }

    if (typeof year !== 'number' || isNaN(year)) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan album. Tahun harus berupa angka',
        })
        .code(400);
    }

    const albumId = await AlbumModel.addAlbum({ name: name.trim(), year });

    return h
      .response({
        status: 'success',
        data: { albumId },
      })
      .code(201);
  } catch (error) {
    console.error('Error in postAlbumHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const getAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const album = await AlbumModel.getAlbumById(id);

    if (!album) {
      return h
        .response({
          status: 'fail',
          message: 'Album tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        data: { album },
      })
      .code(200);
  } catch (error) {
    console.error('Error in getAlbumByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const putAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, year } = request.payload;

    if (!name || typeof name !== 'string' || name.trim() === '' || typeof year !== 'number') {
      return h
        .response({
          status: 'fail',
          message: 'Mohon isi name dan year dengan benar',
        })
        .code(400);
    }

    const updated = await AlbumModel.editAlbumById(id, { name: name.trim(), year });

    if (!updated) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui album. Id tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      })
      .code(200);
  } catch (error) {
    console.error('Error in putAlbumByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const deleteAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const deleted = await AlbumModel.deleteAlbumById(id);

    if (!deleted) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menghapus album. Id tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        message: 'Album berhasil dihapus',
      })
      .code(200);
  } catch (error) {
    console.error('Error in deleteAlbumByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = {
  postAlbumHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
};
