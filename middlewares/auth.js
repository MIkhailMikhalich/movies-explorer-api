const jwt = require('jsonwebtoken');
const IncorrectAuthData = require('../errors/incorrect-auth-data.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new IncorrectAuthData('Нужна авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'jwt');
  } catch (err) {
    throw new IncorrectAuthData('Нужна авторизация');
  }
  req.user = payload;
  return next();
};
