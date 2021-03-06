const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const objectId = require('mongodb').ObjectID;
const User = require('../models/user.js');
const NotFound = require('../errors/not-found-err.js');
const AlreadyExsists = require('../errors/already-exists.js');
const IncorrectAuthData = require('../errors/incorrect-auth-data.js');
const IncorrectData = require('../errors/incorrect-data.js');

module.exports.postUser = (req, res, next) => {
  const { email, name, password } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExsists('Такой email уже существует');
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          email,
          name,
          password: hash,
        }))
        .then((newuser) => {
          User.findById(newuser._id)
            .then((newuserdata) => {
              if (!newuserdata) throw new NotFound('Данный пользоватьель не найден');
              return res.send({ data: newuserdata });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  if (!req.params.id || !objectId.isValid(req.params.id)) throw new IncorrectData('Переданы некорректные данные');
  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new NotFound('Данный пользоватьель не найден');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  if (!req.user._id || !objectId.isValid(req.user._id)) throw new IncorrectData('Переданы некорректные данные');
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFound('Данный пользоватьель не найден');
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name) throw new IncorrectData('Переданы некорректные данные');
  if (!req.user._id || !objectId.isValid(req.user._id)) throw new IncorrectData('Переданы некорректные данные');
  User.findOne({ email })
    .then((user) => {
      if (user) throw new AlreadyExsists('Данная почна занята');
      else {
        User.findByIdAndUpdate(
          req.user._id,
          { email, name },
          { new: true, runValidators: true },
        )
          .then((updUser) => {
            if (!updUser) throw new NotFound('Данный пользоватьель не найден');
            return res.send({ data: updUser });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        if (!user) throw new IncorrectAuthData('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new IncorrectAuthData('Неправильные почта или пароль');
        }
        res.cookie('jwt', jwt, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        res.send({
          token: jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
        });
      });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  User.findById(req.params.id)
    .then(() => {
      res.clearCookie('jwt');
      res.send({ message: 'Успешый выход' });
    })
    .catch(next);
};
