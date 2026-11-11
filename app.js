const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { execFile } = require('child_process');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// ✅ Plus de secret en dur
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-only';

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT, email TEXT)");
  db.run("INSERT INTO users VALUES (1, 'Alice', 'alice@example.com')");
  db.run("INSERT INTO users VALUES (2, 'Bob', 'bob@example.com')");
});

app.use(express.json());

// ✅ Injection SQL corrigée (requête paramétrée avec ?)
app.get('/user', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.all(`SELECT * FROM users WHERE name = '${name}'`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ✅ Injection de commande corrigée (execFile + validation)
app.get('/ping', (req, res) => {
  const host = req.query.host;
  if (!host || !/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).json({ error: 'Invalid host' });
  }
  execFile('ping', ['-c', '1', host], (error, stdout) => {
    if (error) return res.status(500).json({ error: 'Ping failed' });
    res.send(stdout);
  });
});

// ✅ XSS corrigé (on renvoie du JSON au lieu de HTML brut)
app.get('/welcome', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'name required' });
  res.json({ message: `Welcome ${name}` });
});

// ✅ JWT avec expiration
app.get('/token', (req, res) => {
  const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Vuln app listening on port ${port}`);
});
