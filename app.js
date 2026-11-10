const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const app = express();
const port = 3000;


// ⚠️ Base de données en mémoire
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT, email TEXT)");
  db.run("INSERT INTO users VALUES (1, 'Alice', 'alice@example.com')");
  db.run("INSERT INTO users VALUES (2, 'Bob', 'bob@example.com')");
});

app.use(express.json());

// ⚠️ INJECTION SQL (Semgrep va le trouver !)
app.get('/user', (req, res) => {
  const name = req.query.name;
  db.all(`SELECT * FROM users WHERE name = '${name}'`, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// ⚠️ INJECTION DE COMMANDE (Semgrep va le trouver !)
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(error.message);
    res.send(stdout);
  });
});

// ⚠️ XSS (Semgrep va le trouver !)
app.get('/welcome', (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Welcome ${name}</h1>`);
});

// ⚠️ JWT sans expiration (Semgrep va le trouver !)
app.get('/token', (req, res) => {
  const token = jwt.sign({ user: 'admin' }, JWT_SECRET);
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Vuln app listening on port ${port}`);
});
