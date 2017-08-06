const knex = require('../db/db');
const Items = require('../db/items');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200,
};

router.get('/receipts/:receipt_id/items', cors(corsOptions), (req, res, next) => {
  Items.getAll(req.params.receipt_id, (err, items) => {
    if (err) {
      next(err);
    }
    res.json(items);
  });
});

router.post('/receipts/:receipt_id/items', cors(corsOptions), (req, res, next) => {
  Items.addNew(req.body, req.params.receipt_id, (err, item) => {
    if (err) {
      next(err);
    }
    res.json(item);
  });
});

router.get('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  Items.getOne(req.params.id, (err, item) => {
    if (err) {
      next(err);
    }
    res.json(item);
  });
});

router.patch('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  Items.updateItem(req.params.id, req.body, (err, item) => {
    if (err) {
      next(err);
    }
    res.json(item);
  });
});

router.delete('/receipts/:receipt_id/items/:id', cors(corsOptions), (req, res, next) => {
  Items.deleteItem(req.params.id, (err, result) => {
    if (err) {
      next(err);
    }
    res.json(result);
  });
});

// function validate(req, res, next) {
//   const errors = [];
//   ['content'].forEach((field) => {
//     if (!req.body[field] || req.body[field].trim() === '') {
//       errors.push({ field, messages: ['cannot be blank'] });
//     }
//   });
//   if (errors.length) {
//     return res.status(422).json({ errors });
//   }
//   next();
// }

module.exports = router;
