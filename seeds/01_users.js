exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del().then(() =>
  // Inserts seed entries
  knex('users').insert([
    {
      first: 'Amanda',
      last: 'Allen',
      email: 'ahhhh@dev.am',
      password: '123456',
    },
  ]));
};
