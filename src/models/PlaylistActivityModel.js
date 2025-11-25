const db = require('../config/database');
const { nanoid } = require('nanoid');

class PlaylistActivityModel {
  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO playlist_activities
        (id, playlist_id, song_id, user_id, action, time)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      values: [id, playlistId, songId, userId, action, time],
    };

    await db.query(query.text, query.values);
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT
            u.username AS username,
            s.title AS title,
            psa.action,
            psa.time
        FROM playlist_activities psa
        JOIN songs s ON psa.song_id = s.id
        JOIN users u ON psa.user_id = u.id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC
        `,
      values: [playlistId],
    };

    const result = await db.query(query.text, query.values);
    return result.rows;
  }
}

module.exports = new PlaylistActivityModel();
