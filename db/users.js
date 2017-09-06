const knex = require('./db');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;

function Users() {
  return knex('users');
}

const tagDefaults = [
  {
    tag: 'dessert',
  }, {
    tag: 'coffee',
  }, {
    tag: 'vegetables',
  }, {
    tag: 'dining out',
  }, {
    tag: 'meat',
  }, {
    tag: 'bread',
  }, {
    tag: 'fruits',
  }, {
    tag: 'dairy',
  },
];

Users.createUser = (data, callback) => {
  if (data.password.length < 6) {
    return callback('Password must be at least 6 characters');
  }
  data.email = data.email.toLowerCase();
  Users().where('email', data.email).first().then((account) => {
    if (account) {
      return callback('An account with this email already exists');
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
          tagDefaults.map((tag) => {
            tag.user_id = result[0].id;
            return tag;
          });
          knex('tags').insert(tagDefaults).then(() => {
            callback(undefined, result[0]);
          });
        }).catch((err) => {
          console.log(err);
          callback(err);
        });
      });
    });
  });
};

// Users.createFbUser = (data, callback) => {
//   Users().where('fbid', data.id).first().then((account) => {
//     if (account) {
//       const user = [];
//       user.push(account);
//       return callback(undefined, user);
//     }
//     Users().insert({
//       fbid: data.id,
//       first: data.name.givenName,
//       last: data.name.familyName,
//       email: `${data.id}@xxx.com`,
//       password: 'xxxxxxxx',
//       is_admin: false,
//     }, '*').then((result) => {
//       callback(undefined, result);
//     }).catch((err) => {
//       console.log(err);
//       callback(err);
//     });
//   });
// };

Users.authenticateUser = (email, password, callback) => {
  email = email.toLowerCase();
  Users().where({ email }).first().then((user) => {
    if (!user) {
      return callback('Email not found - go back to create an account');
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return callback('Email and password don\'t match');
      }
      return callback(undefined, user);
    });
  });
};

module.exports = Users;
