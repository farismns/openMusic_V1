require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

require('./config/database');

const init = async () => {
  try {
    const server = Hapi.server({
      port: process.env.PORT || 5000,
      host: process.env.HOST || 'localhost',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    server.route(routes);

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      process.exit(1);
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
    process.exit(1);
  }
};

init();
