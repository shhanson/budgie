const knex = require('../db/db');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200
};

router.get('/receipts/:receipt_id/items', cors(corsOptions), (req, res, next) => {
  knex('items').where({receipt_id: req.params.receipt_id}).then((items) => {
    res.json(items);
  }).catch(err => next(err));
});

router.post('/receipts/:receipt_id/items', cors(corsOptions), (req, res, next) => {
  const tagID = (req.body.tag_id
    ? req.body.tag_id
    : '');
  knex('items').insert({name: req.body.name, price: req.body.price, tag_id: tagID, receipt_id: req.params.receipt_id}).returning('*').then((item) => {
    res.json(item);
  }).catch((err) => {
    next(err);
  });
});

router.get('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  knex('items').where({id: req.params.id}).then((item) => {
    res.json(item);
  }).catch(err => next(err));
});

router.patch('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  knex('items').update({name: req.body.name, price: req.body.price, tag_id: req.body.tagId}).where({receipt_id: req.params.receipt_id, id: req.params.id}).returning('*').then(items => res.json(items[0])).catch(err => next(err));
});

router.delete('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  knex('items').del().where({receipt_id: req.params.receipt_id, id: req.params.id}).then(() => res.end()).catch(err => next(err));
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

function insertTag(req) {
  return knex('tags').insert({name: req.body.tag}).returning('id');
}

function addItem(receiptID, tagID, req) {
  return knex('items').insert({name: req.body.name, receipt_id: receiptID, price: req.body.price, tag_id: tagID}).returning('*');
}

module.exports = router;
