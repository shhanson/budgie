const Receipts = require('../db/receipts');
const express = require('express');
const cors = require('cors');
const im = require('imagemagick');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function(req, file, callback) {
    const fileExt = file.mimetype.split('/')[1];
    if (fileExt === 'jpeg') {
      fileExt = 'jpg';
    }
    callback(null, file.fieldname + '-' + Date.now() + '.' + fileExt);
  }
});

const upload = multer({storage: storage}).single('userPhoto');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200
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

router.post('/receipts/image', cors(corsOptions), function(req, res, next){
  console.log(req, 'post request');
  upload(req, res, function(err) {
    const photo = req.file.path;
    if (err) {
      console.log(err, "error uploading file")
      return res.end("Error uploading file.");
    }
    console.log(photo, 'new file file path')
    let optionsObj = [photo, '-resize', '125%', './uploads/cleaned.jpg'];

  let promise = new Promise(function(resolve, reject){
    im.convert(optionsObj, function(err, stdout){
      if (err) {
        console.log(err, 'ERROR!!!!');
        reject('err in promise');
      }
      console.log('inside of im convert');

      // res.send(stdout, 'standard output???');

      resolve('promise complete!');
    });
  })

  promise.then(function(result){
    Tesseract.recognize('./uploads/cleaned.jpg').then((clean) => {
      console.log(clean, 'here is the tessy result');
      res.status(300).send(clean)
    }).catch((err) => {
      console.log("********** RECOGNIZE ERROR **************");
      console.error(err);
    });
  })



    // res.end("File is uploaded");
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



// const lines = clean.text.split('\n');
// const cleanLines = [];
// console.log("LINES?");
// console.log(lines);
//
// const priceRegex = /\d+[\.\,]\d+$/;
// for (let i = 0; i < lines.length; i++) {
//   const item = {};
//   if (lines[i].match(priceRegex)) {
//     item.price = lines[i].match(priceRegex)[0];
//   }
//   item.name = lines[i].substring(0, lines[i].indexOf(item.price)).trim().toLowerCase();
//   item.price = item.price.replace(',', '.');
//   if (item.name && item.price) {
//     cleanLines.push(item);
//   }
// }
