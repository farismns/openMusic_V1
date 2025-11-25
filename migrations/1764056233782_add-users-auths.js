exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'varchar(50)', primaryKey: true },
    username: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    fullname: { type: 'text', notNull: true },
  });

  pgm.createTable('authentications', {
    token: { type: 'text', primaryKey: true },
    user_id: { type: 'varchar(50)', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  pgm.createIndex('authentications', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
  pgm.dropTable('users');
};
