const { nanoid } = require('nanoid');
const Database = require('../config/database');

const db = new Database();

class AlbumModel {
  async addAlbum({ name, year }) {
    try {
      const id = `album-${nanoid(16)}`;
      const query = `
        INSERT INTO albums (id, name, year)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const result = await db.query(query, [id, name, year]);

      if (result.rowCount === 0) {
        throw new Error('Gagal menambahkan album ke database');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error in addAlbum:', error.message);
      throw error;
    }
  }

  async getAlbumById(id) {
    try {
      const query = 'SELECT * FROM albums WHERE id = $1';
      const result = await db.query(query, [id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error in getAlbumById:', error.message);
      throw error;
    }
  }

  async editAlbumById(id, { name, year }) {
    try {
      const query = `
        UPDATE albums
        SET name = $1, year = $2
        WHERE id = $3
        RETURNING id
      `;
      const result = await db.query(query, [name, year, id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error in editAlbumById:', error.message);
      throw error;
    }
  }

  async deleteAlbumById(id) {
    try {
      const query = 'DELETE FROM albums WHERE id = $1 RETURNING id';
      const result = await db.query(query, [id]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error in deleteAlbumById:', error.message);
      throw error;
    }
  }
}

module.exports = new AlbumModel();
