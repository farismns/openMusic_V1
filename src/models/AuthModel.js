const db = require('../config/database');

class AuthModel {
  async addRefreshToken(token, userId) {
    const query = {
      text: 'INSERT INTO authentications (token, user_id) VALUES ($1, $2)',
      values: [token, userId],
    };
    await db.query(query.text, query.values);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await db.query(query.text, query.values);
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await db.query(query.text, query.values);
  }

  async deleteTokensByUserId(userId) {
    const query = {
      text: 'DELETE FROM authentications WHERE user_id = $1',
      values: [userId],
    };
    await db.query(query.text, query.values);
  }
}

module.exports = new AuthModel();
