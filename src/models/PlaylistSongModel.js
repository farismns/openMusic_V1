const db = require('../config/database');
const { nanoid } = require('nanoid');

class PlaylistSongModel {
  async addSongToPlaylist(playlistId, songId) {
    const id = `plsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };
    await db.query(query.text, query.values);
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `
        SELECT s.id, s.title, s.performer
        FROM playlist_songs ps
        JOIN songs s ON ps.song_id = s.id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };
    const result = await db.query(query.text, query.values);
    return result.rows;
  }

  async removeSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
    await db.query(query.text, query.values);
  }
}

module.exports = new PlaylistSongModel();
