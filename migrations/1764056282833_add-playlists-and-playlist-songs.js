exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: { type: 'varchar(50)', primaryKey: true },
    name: { type: 'text', notNull: true },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.createTable('playlist_songs', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('playlist_songs', ['playlist_id']);
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
  pgm.dropTable('playlists');
};
