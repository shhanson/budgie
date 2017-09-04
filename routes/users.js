const users = require('../db/users');
const express = require('express');
const cors = require('cors');
// const Joi = require('joi');
// const schema = require('./validate');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200
};

router.post('/users', cors(corsOptions), (req, res, next) => {
  users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.json(user);
    }
  });
});

router.post('/users/signup', cors(corsOptions), (req, res, next) => {
  // Joi.validate(req.body, schema, (err, value) => {
  //   if (err) {
  //     res.status(400);
  //     res.send(err.message);
  //   } else {
  users.createUser(req.body, (error, user) => {
    if (error) {
      res.status(400);
      res.send(error);
    } else {
      res.json(user);
    }
  });
}
// });
});

module.exports = router;
