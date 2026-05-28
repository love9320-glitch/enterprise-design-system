const Database = require('better-sqlite3');

const db = new Database('./board.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT    NOT NULL,
    content TEXT    NOT NULL,
    author  TEXT    NOT NULL DEFAULT '익명',
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
  )
`);

module.exports = db;
