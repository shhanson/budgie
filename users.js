const knex = require('../db/knex');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;

function Users() {
  return knex('users');
}

Users.createUser = (data, callback) => {
  if (data.password.length < 6) {
    return callback('Password must be at least 6 characters.');
  }
  Users().where('email', data.email).first().then((account) => {
    if (account) {
      return callback('An account with this email already exists.');
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (e, salt) => {
      if (e) {
        callback(e);
      }
      bcrypt.hash(data.password, salt, (error, hash) => {
        if (error) {
          callback(error);
        }
        data.password = hash;
        Users().insert(data, '*').then((result) => {
          callback(undefined, result);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
      });
    });
  });
};

Users.createFbUser = (data, callback) => {
  Users().where('fbid', data.id).first().then((account) => {
    if (account) {
      const user = [];
      user.push(account);
      return callback(undefined, user);
    }
    Users().insert({ fbid: data.id,
      first: data.name.givenName,
      last: data.name.familyName,
      email: `${data.id}@xxx.com`,
      password: 'xxxxxxxx',
      is_admin: false }, '*')
      .then((result) => {
        callback(undefined, result);
      })
      .catch((err) => {
        console.log(err);
        callback(err);
      });
  });
};

Users.authenticateUser = (email, password, callback) => {
  Users().where({ email }).first().then((user) => {
    if (!user) {
      return callback('Not a valid user.');
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return callback('Username and password don\'t match');
      }
      return callback(undefined, user);
    });
  });
};

Users.updateSNPs = data => knex('user_snps').insert(data);
Users.addSNP = data => knex('snps').insert(data);
Users.deleteItem = (id, table) => knex(table).where('id', id).del();
Users.updateItem = (id, data, table) => knex(table).where('id', id).update(data);


module.exports = Users;
