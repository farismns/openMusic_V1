const { Pool } = require('pg');

class Database {
  constructor() {
    this._pool = null;
  }

  init() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
    });

    this._pool.on('error', (err) => {
      console.log('Unexpected error on idle client', err);
      process.exit(1);
    });
  }

  get pool() {
    if (!this._pool) {
      this.init();
    }
    return this._pool;
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.log('Error executing query', { text, error });
      throw error;
    }
  }
}

module.exports = new Database();
