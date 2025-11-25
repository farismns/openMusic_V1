const db = require('../config/database');
const { nanoid } = require('nanoid');

class UserModel {
  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname],
    };

    const result = await db.query(query.text, query.values);
    return result.rows[0].id;
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await db.query(query.text, query.values);
    return result.rows[0] || null;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    };
    const result = await db.query(query.text, query.values);
    return result.rows[0] || null;
  }

  async isUsernameTaken(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };
    const result = await db.query(query.text, query.values);
    return result.rows.length > 0;
  }
}

module.exports = new UserModel();
