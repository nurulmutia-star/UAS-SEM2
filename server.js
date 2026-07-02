import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// 1. Deklarasi __dirname CUKUP SATU KALI di paling atas
const __dirname = dirname(fileURLToPath(import.meta.url));

// 2. Trik panggil database pakai alamat mutlak otomatis
const dbPath = join(__dirname, '../database/database.js');
const { default: db } = await import(`file://${dbPath}`);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 3. Ambil folder frontend dengan aman
app.use(express.static(join(__dirname, '../frontend')));

// API: Ambil semua tugas
app.get('/api/tugas', (req, res) => {
  db.all('SELECT * FROM tugas ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Tambah tugas baru
app.post('/api/tugas', (req, res) => {
  const { nama_tugas, mata_kuliah, deadline } = req.body;
  const sql = 'INSERT INTO tugas (nama_tugas, mata_kuliah, deadline) VALUES (?, ?, ?)';
  db.run(sql, [nama_tugas, mata_kuliah, deadline], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nama_tugas, mata_kuliah, deadline, status: 'Belum Selesai' });
  });
});

// API: Selesaikan tugas
app.put('/api/tugas/:id', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE tugas SET status = ? WHERE id = ?', ['Selesai', id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tugas kelar, mantap!' });
  });
});

// API: Hapus tugas
app.delete('/api/tugas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tugas WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tugas dihapus' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [PREMIUM SERVER] Berjalan gokil di http://localhost:${PORT}`);
});