const albumsHandler = require('../handler/albumsHandler');
const songsHandler = require('../handler/songsHandler');

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
];

module.exports = routes;
