const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
      country: Joi.string(),
      director: Joi.string(),
      duration: Joi.number(),
      year: Joi.string(),
      description: Joi.string(),
      image: Joi.string().pattern(
        new RegExp(
          "(http|https)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*(:(0-9)*)*(/?)([a-zA-Z0-9-.?,'/\\+&%$#_]*)?([a-zA-Z0-9-?,'/+&%$#_]+)",
        ),
      ),
      trailer: Joi.string().pattern(
        new RegExp(
          "(http|https)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*(:(0-9)*)*(/?)([a-zA-Z0-9-.?,'/\\+&%$#_]*)?([a-zA-Z0-9-?,'/+&%$#_]+)",
        ),
      ),
      thumbnail: Joi.string().pattern(
        new RegExp(
          "(http|https)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*(:(0-9)*)*(/?)([a-zA-Z0-9-.?,'/\\+&%$#_]*)?([a-zA-Z0-9-?,'/+&%$#_]+)",
        ),
      ),
      movieId: Joi.string(),
      nameRU: Joi.string(),
      nameEN: Joi.string().alphanum(),
    }),
  }),
  postMovie,
);

module.exports = router;
