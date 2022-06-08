require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { newUserController } = require('./controllers/users');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// RUTAS

app.post('/user', newUserController);

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Lanzamos el servidodr

app.listen(3000, () => {
  console.log('Servidor levantado');
});
