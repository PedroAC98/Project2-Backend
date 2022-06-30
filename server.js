require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const { authUser } = require('./middlewares/auth');
const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  newRecommendationController,
  getSingleRecommendationController,
  deleteRecommendationController,
  getAllRecommendationsController,
  voteRecommendationController,
} = require('./controllers/recommendations');

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('./uploads'));

// RUTAS

app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

app.post('/', authUser, newRecommendationController);
app.get('/recommendations/:id', getSingleRecommendationController);
app.delete('/recommendations/:id', authUser, deleteRecommendationController);
app.get('/recommendations', getAllRecommendationsController);
app.post('/recommendations/vote/:id', authUser, voteRecommendationController);

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
