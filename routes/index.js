const router = require('express').Router();
const users = require('./users.js');
const movies = require('./movies.js');
const { postUser, login, logout } = require('../controllers/users.js');
const NotFound = require('../errors/not-found-err.js');

const auth = require('../middlewares/auth.js');

router.post('/signin', login);
router.post('/signup', postUser);
router.use(auth);
router.use('/users', users);
router.use('/movies', movies);
router.use('/signout', logout);
router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
