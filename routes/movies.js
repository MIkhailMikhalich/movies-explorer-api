const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../constants/constants.js');
const {
  getMovies,
  postMovie,
  deleteMovieById,
} = require('../controllers/movies.js');

router.get('/', getMovies);

router.delete(
  '/:movieid',
  celebrate({
    params: Joi.object().keys({
      movieid: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  deleteMovieById,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(
        regExp,
      ).required(),
      trailer: Joi.string().pattern(
        regExp,
      ).required(),
      thumbnail: Joi.string().pattern(
        regExp,
      ).required(),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().alphanum().required(),
    }),
  }),
  postMovie,
);

module.exports = router;
