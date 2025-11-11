const SongModel = require('../models/SongModel');

const postSongHandler = async (request, h) => {
  try {
    const { title, year, genre, performer, duration, albumId } = request.payload;

    if (!title || !year || !genre || !performer) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan lagu. Mohon isi semua data yang wajib diisi',
      });
      response.code(400);
      return response;
    }

    const songId = await SongModel.addSong({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error in postSongHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const getSongsHandler = async (request, h) => {
  try {
    const songs = await SongModel.getSongs();
    return { status: 'success', data: { songs } };
  } catch (error) {
    console.error('Error in getSongsHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const getSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const song = await SongModel.getSongById(id);
    return { status: 'success', data: { song } };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Lagu tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const putSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    await SongModel.editSongById(id, { title, year, genre, performer, duration, albumId });

    return { status: 'success', message: 'Lagu berhasil diperbarui' };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui lagu. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    await SongModel.deleteSongById(id);
    return { status: 'success', message: 'Lagu berhasil dihapus' };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menghapus lagu. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

module.exports = {
  postSongHandler,
  getSongsHandler,
  getSongByIdHandler,
  putSongByIdHandler,
  deleteSongByIdHandler,
};
