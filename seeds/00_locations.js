exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('receipts').del().then(knex('locations').del().then(() =>
  // Inserts seed entries
  knex('locations').insert([
    {
      id: 1,
      location: 'Trader Joes',
    }, {
      id: 2,
      location: 'Whole Foods',
    }, {
      id: 3,
      location: 'HEB',
    }, {
      id: 4,
      location: 'Starbucks',
    },
  ])));
};
