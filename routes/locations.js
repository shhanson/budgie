const knex = require('../db/db');
const express = require('express');

const router = express.Router();

router.get('/locations', (req, res, next) => {
  knex('locations').then(locations => res.json(locations)).catch(err => next(err));
});

router.post('/locations', validate, (req, res, next) => {
  knex('locations').insert({ location: req.body.location }).returning('id').then(id => res.json(id)).catch(err => next(err));
});

router.patch('/locations/:id', validate, (req, res, next) => {
  knex('locations').update({ location: req.body.location }).where({ id: req.params.id }).returning('*').then(location => res.json(location[0])).catch(err => next(err));
});

router.delete('/locations/:id', (req, res, next) => {
  knex('items').del().where({ id: req.params.id }).then(() => res.end()).catch(err => next(err));
});

function validate(req, res, next) {
  const errors = [];
  ['content'].forEach((field) => {
    if (!req.body[field] || req.body[field].trim() === '') {
      errors.push({ field, messages: ['cannot be blank'] });
    }
  });
  if (errors.length) {
    return res.status(422).json({ errors });
  }
  next();
}

module.exports = router;
