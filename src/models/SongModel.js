const { nanoid } = require('nanoid');
const Database = require('../config/database');

const db = new Database();

class SongModel {
  async addSong({ title, year, genre, performer, duration, albumId }) {
    try {
      const id = `song-${nanoid(16)}`;
      const query = {
        text: `
          INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `,
        values: [id, title, year, genre, performer, duration, albumId],
      };

      const result = await db.query(query.text, query.values);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error in addSong:', error);
      throw error;
    }
  }

  async getSongs() {
    try {
      const result = await db.query('SELECT id, title, performer FROM songs');
      return result.rows;
    } catch (error) {
      console.error('Error in getSongs:', error);
      throw error;
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id],
    };

    const result = await db.query(query.text, query.values);
    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: `
        UPDATE songs
        SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6
        WHERE id=$7
        RETURNING id
      `,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await db.query(query.text, query.values);
    return result.rowCount > 0;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query.text, query.values);
    return result.rowCount > 0;
  }
}

module.exports = new SongModel();
