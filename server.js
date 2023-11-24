const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// SQLite veritabanı bağlantısı oluştur
const db = new sqlite3.Database('blog.db');

// Tablo oluştur
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/posts', (req, res) => {
  // Tüm yazıları getir
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.post('/posts', (req, res) => {
  const content = req.body.content;

  // Yeni yazıyı ekleyin
  db.run("INSERT INTO posts (content) VALUES (?)", [content], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('Post Created');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
