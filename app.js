const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');
const rateLimit = require('./security/rate_limiter.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');

const app = express();
const { PORT = 3001 } = process.env;

require('dotenv').config();

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_Adress : 'mongodb://localhost:27017/moviesDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(rateLimit);

app.use(express.json());

app.use(requestLogger);

app.use('/', routes);

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
