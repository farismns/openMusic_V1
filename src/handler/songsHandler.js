const SongModel = require('../models/SongModel');

const postSongHandler = async (request, h) => {
  try {
    const { title, year, genre, performer, duration, albumId } = request.payload;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan lagu. Mohon isi judul lagu dengan benar',
        })
        .code(400);
    }

    if (!year || typeof year !== 'number' || year < 1000 || year > new Date().getFullYear()) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan lagu. Mohon isi tahun lagu dengan benar',
        })
        .code(400);
    }

    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan lagu. Mohon isi genre lagu dengan benar',
        })
        .code(400);
    }

    if (!performer || typeof performer !== 'string' || performer.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan lagu. Mohon isi performer lagu dengan benar',
        })
        .code(400);
    }

    if (albumId && typeof albumId !== 'string') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan lagu. Mohon isi albumId dengan benar',
        })
        .code(400);
    }

    const songId = await SongModel.addSong({ title, year, genre, performer, duration, albumId });

    return h
      .response({
        status: 'success',
        data: { songId },
      })
      .code(201);
  } catch (error) {
    console.error('Error in postSongHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const putSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Mohon isi judul lagu dengan benar',
        })
        .code(400);
    }

    if (!year || typeof year !== 'number' || year < 1000 || year > new Date().getFullYear()) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Mohon isi tahun lagu dengan benar',
        })
        .code(400);
    }

    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Mohon isi genre lagu dengan benar',
        })
        .code(400);
    }

    if (!performer || typeof performer !== 'string' || performer.trim() === '') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Mohon isi performer lagu dengan benar',
        })
        .code(400);
    }

    if (albumId && typeof albumId !== 'string') {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Mohon isi albumId dengan benar',
        })
        .code(400);
    }

    const updated = await SongModel.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    if (!updated) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui lagu. Id tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      })
      .code(200);
  } catch (error) {
    console.error('Error in putSongByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const getSongsHandler = async (request, h) => {
  try {
    const songs = await SongModel.getSongs();
    return h
      .response({
        status: 'success',
        data: { songs },
      })
      .code(200);
  } catch (error) {
    console.error('Error in getSongsHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const getSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const song = await SongModel.getSongById(id);

    if (!song) {
      return h
        .response({
          status: 'fail',
          message: 'Lagu tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        data: { song },
      })
      .code(200);
  } catch (error) {
    console.error('Error in getSongByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

const deleteSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const deleted = await SongModel.deleteSongById(id);

    if (!deleted) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menghapus lagu. Id tidak ditemukan',
        })
        .code(404);
    }

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil dihapus',
      })
      .code(200);
  } catch (error) {
    console.error('Error in deleteSongByIdHandler:', error);
    return h
      .response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      })
      .code(500);
  }
};

module.exports = {
  postSongHandler,
  getSongsHandler,
  getSongByIdHandler,
  putSongByIdHandler,
  deleteSongByIdHandler,
};
