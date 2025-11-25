const CollaborationModel = require('../models/CollaborationModel');
const PlaylistModel = require('../models/PlaylistModel');
const UserModel = require('../models/UserModel');
const { verifyAccessToken } = require('../utils/tokenVerif');

const collaborationHandler = {
  async postCollaborationHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { playlistId, userId: collaboratorId } = request.payload;

      if (!playlistId || !collaboratorId) {
        return h
          .response({
            status: 'fail',
            message: 'playlistId dan userId wajib diisi',
          })
          .code(400);
      }

      const playlist = await PlaylistModel.getPlaylistById(playlistId);
      if (!playlist) {
        return h
          .response({
            status: 'fail',
            message: 'Playlist tidak ditemukan',
          })
          .code(404);
      }

      const isOwner = await PlaylistModel.verifyOwner(playlistId, userId);
      if (!isOwner) {
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak menambahkan kolaborator',
          })
          .code(403);
      }

      const user = await UserModel.getUserById(collaboratorId);
      if (!user) {
        return h
          .response({
            status: 'fail',
            message: 'User tidak ditemukan',
          })
          .code(404);
      }

      const collaborationId = await CollaborationModel.addCollaboration({
        playlistId,
        userId: collaboratorId,
      });

      return h
        .response({
          status: 'success',
          data: { collaborationId },
        })
        .code(201);
    } catch (error) {
      if (error.statusCode === 401) {
        return h
          .response({
            status: 'fail',
            message: error.message || 'Unauthorized',
          })
          .code(401);
      }

      console.error('Error in postCollaborationHandler:', error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan server',
        })
        .code(500);
    }
  },

  async deleteCollaborationHandler(request, h) {
    try {
      const userId = verifyAccessToken(request, h);
      const { playlistId, userId: collaboratorId } = request.payload;

      const isOwner = await PlaylistModel.verifyOwner(playlistId, userId);
      if (!isOwner) {
        return h
          .response({
            status: 'fail',
            message: 'Anda tidak berhak menghapus kolaborator',
          })
          .code(403);
      }

      await CollaborationModel.deleteCollaboration({ playlistId, userId: collaboratorId });

      return h
        .response({
          status: 'success',
          message: 'Kolaborasi berhasil dihapus',
        })
        .code(200);
    } catch (error) {
      if (error.statusCode === 401) {
        return h
          .response({
            status: 'fail',
            message: error.message || 'Unauthorized',
          })
          .code(401);
      }
      console.error('Error in deleteCollaborationHandler:', error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan server',
        })
        .code(500);
    }
  },
};

module.exports = collaborationHandler;
