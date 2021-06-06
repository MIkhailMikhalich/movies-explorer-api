const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth.js');
const NotFound = require('./errors/not-found-err.js');
const users = require('./routes/users.js');
const movies = require('./routes/movies.js');
const { postUser, login, logout } = require('./controllers/users.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
require('dotenv').config();

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
    name: Joi.string().min(2).max(30),
  }),
}), postUser);

app.use(auth);

app.post('/signout', logout);

app.use('/users', users);

app.use('/movies', movies);

app.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode || err.statusCode === 500) return res.status(500).send({ message: 'Произошла ошибка' });
  if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
  return res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
