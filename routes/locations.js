const knex = require('../db/db');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200,
};

router.get('/locations/users/:user_id', cors(corsOptions), (req, res, next) => {
  knex('locations').where({ user_id: req.params.user_id }).then(locations => res.json(locations)).catch(err => next(err));
});

router.post('/locations/users/:user_id', cors(corsOptions), (req, res, next) => {
  knex('locations').insert({ location: req.body.location, user_id: req.params.user_id }).returning('id').then(id => res.json(id)).catch(err => next(err));
});

router.get('/locations/:id', cors(corsOptions), (req, res, next) => {
  knex('locations').where({ id: req.params.id }).then(location => res.json(location)).catch(err => next(err));
});

router.patch('/locations/:id', cors(corsOptions), (req, res, next) => {
  knex('locations').update({ location: req.body.location }).where({ id: req.params.id }).returning('*').then(location => res.json(location[0])).catch(err => next(err));
});

router.delete('/locations/:id', cors(corsOptions), (req, res, next) => {
  knex('items').del().where({ id: req.params.id }).then(() => res.end()).catch(err => next(err));
});

// function validate(req, res, next) {
//   const errors = [];
//   ['content'].forEach((field) => {
//     if (!req.body[field] || req.body[field].trim() === '') {
//       errors.push({field, messages: ['cannot be blank']});
//     }
//   });
//   if (errors.length) {
//     return res.status(422).json({errors});
//   }
//   next();
// }

module.exports = router;
