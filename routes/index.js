const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users.js');
const movies = require('./movies.js');
const { postUser, login, logout } = require('../controllers/users.js');
const NotFound = require('../errors/not-found-err.js');

const auth = require('../middlewares/auth.js');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), postUser);
router.use(auth);
router.use('/users', users);
router.use('/movies', movies);
router.use('/signout', logout);
router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
