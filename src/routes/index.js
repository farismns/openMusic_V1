const albumsHandler = require('../handler/albumsHandler');
const songsHandler = require('../handler/songsHandler');
const userHandler = require('../handler/userHandler');
const authHandler = require('../handler/authHandler');
const playlistHandler = require('../handler/playlistHandler');

const routes = [
  // ALBUMS ROUTES
  {
    method: 'POST',
    path: '/albums',
    handler: albumsHandler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumsHandler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumsHandler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumsHandler.deleteAlbumByIdHandler,
  },

  // SONGS ROUTES
  {
    method: 'POST',
    path: '/songs',
    handler: songsHandler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: songsHandler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: songsHandler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: songsHandler.putSongByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: songsHandler.deleteSongByIdHandler,
  },

  // REGIST & AUTH ROUTES
  {
    method: 'POST',
    path: '/users',
    handler: userHandler.postUserHandler,
  },

  {
    method: 'POST',
    path: '/authentications',
    handler: authHandler.postAuthHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authHandler.putAuthHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authHandler.deleteAuthHandler,
  },

  // PLAYLISTS ROUTES
  {
    method: 'POST',
    path: '/playlists',
    handler: playlistHandler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: playlistHandler.getPlaylistsHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: playlistHandler.deletePlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: playlistHandler.postSongToPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: playlistHandler.getSongsInPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: playlistHandler.deleteSongFromPlaylistHandler,
  },
];

module.exports = routes;
