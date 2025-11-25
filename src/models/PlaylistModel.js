const db = require('../config/database');
const { nanoid } = require('nanoid');

class PlaylistModel {
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await db.query(query.text, query.values);
    return result.rows[0].id;
  }

  async getPlaylistsByOwner(owner) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username
        FROM playlists p
        JOIN users u ON p.owner = u.id
        WHERE p.owner = $1
      `,
      values: [owner],
    };
    const result = await db.query(query.text, query.values);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username, p.owner
        FROM playlists p
        JOIN users u ON p.owner = u.id
        WHERE p.id = $1
      `,
      values: [id],
    };
    const result = await db.query(query.text, query.values);
    return result.rows[0];
  }

  async verifyOwner(playlistId, userId) {
    const playlist = await this.getPlaylistById(playlistId);
    if (!playlist) return null;
    return playlist.owner === userId;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    };
    await db.query(query.text, query.values);
  }

  async getPlaylistsByUserId(userId) {
    const query = {
      text: `
        SELECT DISTINCT p.id, p.name, u.username
        FROM playlists p
        JOIN users u ON u.id = p.owner
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        WHERE p.owner = $1 OR c.user_id = $1
        ORDER BY p.id ASC
        `,
      values: [userId],
    };
    const result = await db.query(query.text, query.values);
    return result.rows;
  }
}

module.exports = new PlaylistModel();
