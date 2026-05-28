const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 글 목록
app.get('/api/posts', (req, res) => {
  const posts = db.prepare(
    'SELECT id, title, author, created_at FROM posts ORDER BY id DESC'
  ).all();
  res.json(posts);
});

// 글 상세
app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: '글을 찾을 수 없습니다.' });
  res.json(post);
});

// 글 작성
app.post('/api/posts', (req, res) => {
  const { title, content, author } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
  }
  const result = db.prepare(
    'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)'
  ).run(title.trim(), content.trim(), (author?.trim() || '익명'));
  res.status(201).json({ id: result.lastInsertRowid });
});

// 글 삭제
app.delete('/api/posts/:id', (req, res) => {
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: '글을 찾을 수 없습니다.' });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
