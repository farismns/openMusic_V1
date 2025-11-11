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
];

module.exports = routes;
