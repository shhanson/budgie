const knex = require('../db/db');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200
}

router.get('/tags/users/:user_id', cors(corsOptions), (req, res, next) => {
  knex('tags').where({user_id: req.params.user_id}).then(tags => res.json(tags)).catch(err => next(err));
});

router.post('/tags/users/:user_id', cors(corsOptions), (req, res, next) => {
  knex('tags').insert({name: req.body.name, user_id: req.params.user_id}).returning('*').then(tag => res.json(tag)).catch(err => next(err));
});

router.get('/tags/:id', cors(corsOptions), (req, res, next) => {
  knex('tags').where({id: req.params.id}).then(tags => res.json(tags)).catch(err => next(err));
});

router.patch('/tags/:id', cors(corsOptions), (req, res, next) => {
  knex('tags').update({name: req.body.name}).where({id: req.params.id}).returning('*').then(tag => res.json(tag)).catch(err => next(err));
});

router.delete('/tags/:id', cors(corsOptions), (req, res, next) => {
  knex('tags').del().where({id: req.params.id}).then(() => res.end()).catch(err => next(err));
});

function validate(req, res, next) {
  const errors = [];
  ['content'].forEach((field) => {
    if (!req.body[field] || req.body[field].trim() === '') {
      errors.push({field, messages: ['cannot be blank']});
    }
  });
  if (errors.length) {
    return res.status(422).json({errors});
  }
  next();
}

module.exports = router;
