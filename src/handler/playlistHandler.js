const PlaylistModel = require('../models/PlaylistModel');
const PlaylistSongModel = require('../models/PlaylistSongModel');
const SongModel = require('../models/SongModel');
const CollaborationModel = require('../models/CollaborationModel');
const PlaylistActivityModel = require('../models/PlaylistActivityModel');
const UserModel = require('../models/UserModel');
const { verifyAccessToken } = require('../utils/tokenVerif');

const playlistHandler = {
  async postPlaylistHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { name } = request.payload;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return h.response({ status: 'fail', message: 'Nama playlist wajib diisi' }).code(400);
      }

      const playlistId = await PlaylistModel.addPlaylist({
        name: name.trim(),
        owner: userId,
      });

      return h.response({ status: 'success', data: { playlistId } }).code(201);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in postPlaylistHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async getPlaylistsHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);

      const playlists = await PlaylistModel.getPlaylistsByUserId(userId);

      return h.response({ status: 'success', data: { playlists } }).code(200);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in getPlaylistsHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async deletePlaylistHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { id } = request.params;

      const isOwner = await PlaylistModel.verifyOwner(id, userId);
      if (isOwner === null) return h.response({ status: 'fail', message: 'Playlist tidak ditemukan' }).code(404);
      if (!isOwner)
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak menghapus playlist ini',
          })
          .code(403);

      await PlaylistModel.deletePlaylist(id);
      return h.response({ status: 'success', message: 'Playlist berhasil dihapus' }).code(200);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in deletePlaylistHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async postSongToPlaylistHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { id } = request.params;
      const { songId } = request.payload;

      if (!songId || typeof songId !== 'string' || songId.trim() === '') {
        return h.response({ status: 'fail', message: 'songId wajib diisi' }).code(400);
      }

      const isOwner = await PlaylistModel.verifyOwner(id, userId);
      const isCollaborator = await CollaborationModel.verifyCollaborator(id, userId);

      if (isOwner === null) return h.response({ status: 'fail', message: 'Playlist tidak ditemukan' }).code(404);
      if (!isOwner && !isCollaborator)
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak menambahkan lagu ke playlist ini',
          })
          .code(403);

      const song = await SongModel.getSongById(songId);
      if (!song) return h.response({ status: 'fail', message: 'Lagu tidak ditemukan' }).code(404);

      await PlaylistSongModel.addSongToPlaylist(id, songId);

      if (PlaylistActivityModel?.addActivity) {
        await PlaylistActivityModel.addActivity({
          playlistId: id,
          songId,
          userId,
          action: 'add',
        });
      }

      return h.response({ status: 'success', message: 'Lagu berhasil ditambahkan' }).code(201);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);

      if (error.code === '23505') return h.response({ status: 'fail', message: 'Lagu sudah ada di playlist ini' }).code(400);

      console.error('Error in postSongToPlaylistHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async getSongsInPlaylistHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { id } = request.params;

      const playlist = await PlaylistModel.getPlaylistById(id);
      if (!playlist) return h.response({ status: 'fail', message: 'Playlist tidak ditemukan' }).code(404);

      const isOwner = await PlaylistModel.verifyOwner(id, userId);
      const isCollaborator = await CollaborationModel.verifyCollaborator(id, userId);

      if (!isOwner && !isCollaborator)
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak mengakses playlist ini',
          })
          .code(403);

      const songs = await PlaylistSongModel.getSongsInPlaylist(id);

      return h
        .response({
          status: 'success',
          data: {
            playlist: {
              id: playlist.id,
              name: playlist.name,
              username: playlist.username,
              songs,
            },
          },
        })
        .code(200);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in getSongsInPlaylistHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { id } = request.params;
      const { songId } = request.payload;

      if (!songId || typeof songId !== 'string' || songId.trim() === '') {
        return h.response({ status: 'fail', message: 'songId wajib diisi' }).code(400);
      }

      const isOwner = await PlaylistModel.verifyOwner(id, userId);
      const isCollaborator = await CollaborationModel.verifyCollaborator(id, userId);

      if (isOwner === null) return h.response({ status: 'fail', message: 'Playlist tidak ditemukan' }).code(404);
      if (!isOwner && !isCollaborator)
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak menghapus lagu dari playlist ini',
          })
          .code(403);

      await PlaylistSongModel.removeSongFromPlaylist(id, songId);

      if (PlaylistActivityModel?.addActivity) {
        await PlaylistActivityModel.addActivity({
          playlistId: id,
          songId,
          userId,
          action: 'delete',
        });
      }

      return h.response({ status: 'success', message: 'Lagu berhasil dihapus' }).code(200);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in deleteSongFromPlaylistHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },

  async getPlaylistActivitiesHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { id } = request.params;

      const playlist = await PlaylistModel.getPlaylistById(id);
      if (!playlist) return h.response({ status: 'fail', message: 'Playlist tidak ditemukan' }).code(404);

      const isOwner = await PlaylistModel.verifyOwner(id, userId);
      const isCollaborator = await CollaborationModel.verifyCollaborator(id, userId);

      if (!isOwner && !isCollaborator)
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak melihat aktivitas playlist ini',
          })
          .code(403);

      const activities = await PlaylistActivityModel.getActivitiesByPlaylistId(id);

      return h
        .response({
          status: 'success',
          data: {
            playlistId: id,
            activities,
          },
        })
        .code(200);
    } catch (error) {
      if (error.statusCode === 401) return h.response({ status: 'fail', message: error.message }).code(401);
      console.error('Error in getPlaylistActivitiesHandler:', error);
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  },
};

module.exports = playlistHandler;
