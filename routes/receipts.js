const knex = require('../db/db');
const express = require('express');

const router = express.Router();

router.get('/receipts/users/:id', (req, res, next) => {
  knex('receipts').where({
    user_id: parseInt(req.params.id, 10),
  }).then((receipts) => {
    knex('items').whereIn('receipt_id', receipts.map(r => r.id)).then((items) => {
      const itemsByReceiptId = items.reduce((result, item) => {
        result[item.receipt_id] = result[item.receipt_id] || [];
        result[item.receipt_id].push(item);
        return result;
      }, {});
      receipts.forEach((receipt) => {
        receipt.items = itemsByReceiptId[receipt.id] || [];
      });
      res.json(receipts);
    });
  }).catch(err => next(err));
});

router.post('/receipts/users/:id', validate, (req, res, next) => {
  console.log('request: ', req.body);
  knex('receipts').insert({ location_id: req.body.location_id, date: req.body.date, user_id: req.params.id }).returning('id').then((id) => {
    req.body.listItems.map((item) => {
      item.receipt_id = id[0];
    });
    console.log('mapped req: ', req.body);
    knex('items').insert(req.body.listItems).returning('*').then((results) => {
      res.json(results);
    }).catch((err) => {
      next(err);
    });
  });
});

router.get('/receipts/:id', (req, res, next) => {
  knex('receipts').where({ id: req.params.id }).first().returning('*').then((receipt) => {
    if (!receipt) {
      res.status(400);
      res.send('not found.');
    }
    knex('locations').where({ id: receipt.id }).then((location) => {
      receipt.location_name = location;
    });
    res.json(receipt);
  }).catch(err => next(err));
});

router.patch('/receipts/:id', (req, res, next) => {
  knex('receipts').update(params(req)).where({
    id: parseInt(req.params.id),
  }).returning('*').then(receipt => res.json(receipt[0])).catch(err => next(err));
});

router.delete('/receipts/:id', (req, res, next) => {
  knex('receipts').del().where({
    id: parseInt(req.params.id),
  }).then(() => res.end()).catch(err => next(err));
});

function params(req) {
  return { location_id: req.body.locationId, date: req.body.date };
}

function validate(req, res, next) {
  const errors = [];
  ['location_id', 'date'].forEach((field) => {
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
