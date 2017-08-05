const knex = require('./db');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;

function Receipts() {
  return knex('receipts');
}

Receipts.getForUser = (userId, callback) => {
  Receipts().where('user_id', userId).first().then((receipts) => {
    if (!receipt) {
      return callback('No receipts found for user.');
    }
    return receipts;
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};

Receipts.addNew = (data, callback) => {
  Receipts.insert(data).returning('*').then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};

module.exports = Receipts;
