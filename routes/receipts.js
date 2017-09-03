const Receipts = require('../db/receipts');
const express = require('express');
const cors = require('cors');
const im = require('imagemagick');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
// const sys = require('sys')
const exec = require('child_process').exec;

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

router.post('/receipts/image', cors(corsOptions), function(req, res, next) {
  let newdate = new Date();
  let date = newdate.getTime();

  let file = `./uploads/temp${date}.png`
  fs.writeFile(file, req.body.data, 'base64', (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send('uh oh.');
    }
    let cleaned = `./uploads/${date}.tif`;
    exec(`./textcleaner.sh -g -e stretch -f 40 -o 12 -u -s 1 -T -p 20 ${file} ${cleaned}`, (e) => {
      if (e) {
        console.log(err, 'txtcleaner error');
        return res.status(400).send('uh oh.');
      }
      let output = `output${date}`;
      exec(`tesseract ${cleaned} -psm 6 ${output}`, (err) => {
        if (err) {
          console.log(err, 'tessy error');
          return res.status(400).send('uh oh.');
        }
        fs.readFile(`${output}.txt`, 'utf-8', (error, text) => {
          if (error) {
            console.log(err, 'readfile error');
            return res.status(400).send('uh oh.');
          }
          const lines = text.split('\n');
          const cleanLines = [];
          const priceRegex = /\d+\s*[\.\,\-]\s*\d+\s*\w*$/;
          for (let i = 0; i < lines.length; i++) {
            const item = {};
            if (lines[i].match(priceRegex)) {
              item.price = lines[i].match(priceRegex)[0];
              item.name = lines[i].substring(0, lines[i].indexOf(item.price)).trim().toLowerCase();
              item.price = item.price.replace(',', '.').replace(/\s+/, '').replace(/([a-zA-Z])/, '');
              item.name = item.name.replace(/[^\w\s]/, '');
            }
            if (item.name && item.price) {
              cleanLines.push(item);
            }
          }
          exec(`rm ${file} && rm ${cleaned} && rm ${output}.txt`, () => {})
          res.json(cleanLines);
        });
      });
    });
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

module.exports = router;
