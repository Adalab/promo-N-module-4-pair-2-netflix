const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const path = require('path');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//configuramos base de datos
const db = new Database('./src/db/database.db', {
  verbose: console.log,
});

// Escribimos los endpoints que queramos
server.get('/movies', (req, res) => {
  const query = db.prepare('SELECT * FROM movies');
  const movies = query.all();
  console.log(movies);
  res.json({
    movies: movies,
  });
});
server.get('/movie/:movieId', (req, res) => {
  console.log('url=', req.params);
  const findMovie = movies.find((movie) => movie.id === req.params.movieId);
  console.log('movieId', findMovie);
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

// Endpoint para gestionar los errores 404
server.get('*', (req, res) => {
  // Relativo a este directorio
  const notFoundFileRelativePath = '../public-react/404-not-found.html';
  const notFoundFileAbsolutePath = path.join(
    __dirname,
    notFoundFileRelativePath
  );
  res.status(404).sendFile(notFoundFileAbsolutePath);
});
