const db = require('../config/database');
const { nanoid } = require('nanoid');

class CollaborationModel {
  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO collaborations (id, playlist_id, user_id)
             VALUES ($1, $2, $3) RETURNING id`,
      values: [id, playlistId, userId],
    };
    const result = await db.query(query.text, query.values);
    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    await db.query('DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2', [playlistId, userId]);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT 1 FROM collaborations WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };
    const result = await db.query(query.text, query.values);
    return result.rowCount > 0;
  }
}

module.exports = new CollaborationModel();
