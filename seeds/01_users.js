exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del().then(() =>
  // Inserts seed entries
  knex('users').insert([
    {
      id: 1,
      first: 'bob',
      last: 'shopper',
      email: 'bob@aol.com',
      password: 'bob',
    },
  ]));
};
