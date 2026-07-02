import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Hack otomatis biar jalurnya absolut aman sentosa dari drama OneDrive
const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'todo.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database mogok:', err.message);
  } else {
    console.log('⚡ [SQLITE] Database terkoneksi lancar jaya!');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tugas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_tugas TEXT NOT NULL,
      mata_kuliah TEXT,
      deadline TEXT,
      status TEXT DEFAULT 'Belum Selesai'
    )
  `);
});

export default db;