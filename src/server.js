// src/server.js
require('dotenv').config();
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      status: 'success',
      message: 'OpenMusic API berjalan!',
    }),
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
