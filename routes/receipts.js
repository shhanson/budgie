const Receipts = require('../db/receipts');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200,
};

router.get('/receipts/users/:id', cors(corsOptions), (req, res, next) => {
  Receipts.getAll(req.params.id, (err, receipts) => {
    if (err) {
      next(err);
    } else {
      res.json(receipts);
    }
  });
});

router.post('/receipts/users/:id', cors(corsOptions), (req, res, next) => {
  Receipts.addNew(req.body, req.params.id, (err, newReceipt) => {
    if (err) {
      next(err);
    } else {
      res.json(newReceipt);
    }
  });
});

router.get('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.getOne(req.params.id, (err, receipt) => {
    if (err) {
      next(err);
    } else {
      res.json(receipt);
    }
  });
});

router.patch('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.updateReceipt(req.params.id, req.body, (err, receipt) => {
    if (err) {
      next(err);
    } else {
      res.json(receipt);
    }
  });
});

router.delete('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.deleteReceipt(req.params.id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(result);
    }
  });
});

// function validate(req, res, next) {
//   const errors = [];
//   ['location_id', 'date'].forEach((field) => {
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
