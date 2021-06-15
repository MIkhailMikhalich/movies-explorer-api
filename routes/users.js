const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const express = require('express');

const {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  getCurrentUser,
} = require('../controllers/users.js');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).hex()
        .required(),
    }),
  }),
  getUserById,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  express.json(),
  postUser,
);

router.patch(
  '/me',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

module.exports = router;
