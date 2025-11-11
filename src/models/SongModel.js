const db = require('../config/database');
const { nanoid } = require('nanoid');

class SongsModel {
  async addSong({ title, year, genre, performer, duration, albumId }) {
    try {
      const id = `song-${nanoid(16)}`;
      const query = `
        INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;
      const result = await db.query(query, [id, title, year, genre, performer, duration, albumId]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error in addSong:', error.message);
      throw error;
    }
  }

  async getSongs() {
    try {
      const result = await db.query('SELECT id, title, performer FROM songs');
      return result.rows;
    } catch (error) {
      console.error('Error in getSongs:', error.message);
      throw error;
    }
  }

  async getSongById(id) {
    try {
      const result = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
      if (result.rowCount === 0) throw new Error('Lagu tidak ditemukan');
      return result.rows[0];
    } catch (error) {
      console.error('Error in getSongById:', error.message);
      throw error;
    }
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    try {
      const query = `
        UPDATE songs
        SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6
        WHERE id = $7
        RETURNING id
      `;
      const result = await db.query(query, [title, year, genre, performer, duration, albumId, id]);
      if (result.rowCount === 0) throw new Error('Lagu tidak ditemukan');
      return result.rows[0].id;
    } catch (error) {
      console.error('Error in editSongById:', error.message);
      throw error;
    }
  }

  async deleteSongById(id) {
    try {
      const result = await db.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id]);
      if (result.rowCount === 0) throw new Error('Lagu tidak ditemukan');
      return result.rows[0].id;
    } catch (error) {
      console.error('Error in deleteSongById:', error.message);
      throw error;
    }
  }
}

module.exports = new SongsModel();
