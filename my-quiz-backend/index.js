const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurer le middleware pour parser les requêtes POST
app.use(bodyParser.json());

// Configurer la connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3_T*3HqaAtGFbJ9z',
  database: 'quiz_app'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

// Créer une table pour sauvegarder les résultats
app.get('/createQuizTable', (req, res) => {
  let sql = 'CREATE TABLE results(id INT AUTO_INCREMENT, user_id VARCHAR(255), score INT, PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send('Table résultats créée');
  });
});

// Enregistrer un résultat de questionnaire
app.post('/saveResult', (req, res) => {
  let result = { user_id: req.body.user_id, score: req.body.score };
  let sql = 'INSERT INTO results SET ?';
  db.query(sql, result, (err, result) => {
    if (err) throw err;
    res.send('Résultat sauvegardé');
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
