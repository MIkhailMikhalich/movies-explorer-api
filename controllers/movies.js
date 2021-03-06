const objectId = require("mongodb").ObjectID;
const regExp = require("../constants/constants.js");
const NotFound = require("../errors/not-found-err.js");
const IncorrectData = require("../errors/incorrect-data.js");
const DoNotHavePermission = require("../errors/do-not-have-permisson.js");
const Movie = require("../models/movie.js");

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  const links = [image, trailer, thumbnail];
  if (!image || !regExp.test(links[0])) {
    throw new IncorrectData("Переданы некорректные данные");
  }
  regExp.test(links[1]);
  if (!trailer || !regExp.test(links[1])) {
    throw new IncorrectData("Переданы некорректные данные");
  }
  regExp.test(links[2]);
  if (!thumbnail || !regExp.test(links[2])) {
    throw new IncorrectData("Переданы некорректные данные");
  }
  if (!nameRU || !nameEN)
    throw new IncorrectData("Переданы некорректные данные");
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    owner,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const filteredMovies = movies.filter((item) => {
        if (item.owner === req.user._id) return item;
      });
      res.send(filteredMovies);
    })

    .catch(next);
};
module.exports.deleteMovieById = (req, res, next) => {
  if (!objectId.isValid(req.params.movieid))
    throw new IncorrectData("Переданы некоректные данные");
  Movie.findById(req.params.movieid)
    .then((movie) => {
      if (!movie) throw new NotFound("Данный фильм не найден");
      const movieID = String(movie.owner);
      const userID = req.user._id;
      if (userID === movieID) {
        Movie.findByIdAndRemove(req.params.movieid)
          .then(() => {
            if (!movie) throw new NotFound("Данный фильм не найден");
            return res.send({ data: movie });
          })
          .catch(next);
      } else
        throw new DoNotHavePermission("Фильм принадлежит другому пользователю");
    })
    .catch(next);
};
