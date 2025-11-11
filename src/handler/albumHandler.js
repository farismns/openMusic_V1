const postAlbumHandler = async (request, h) => {
  try {
    const { name, year } = request.payload;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan album. Mohon isi nama album dengan benar',
      });
      response.code(400);
      return response;
    }

    if (typeof year !== 'number' || isNaN(year)) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan album. Tahun harus berupa angka',
      });
      response.code(400);
      return response;
    }

    const albumId = await AlbumModel.AddAlbum({
      name: name.trim(),
      year,
    });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error in postAlbumHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const getAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const album = await AlbumModel.GetAlbumById(id);

    if (!album) {
      const response = h.response({
        status: 'fail',
        message: 'Album tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: { album },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error('Error in getAlbumByIdHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

// === UPDATE (PUT /albums/{id}) ===
const putAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, year } = request.payload;

    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui album. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    if (!name || !year) {
      const response = h.response({
        status: 'fail',
        message: 'Mohon isi name dan year dengan benar',
      });
      response.code(400);
      return response;
    }

    albums[index] = { ...albums[index], name, year };

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

// === DELETE (DELETE /albums/{id}) ===
const deleteAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menghapus album. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    albums.splice(index, 1);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  postAlbumHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
};
