exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('receipts').del().then(knex('locations').del().then(() =>
  // Inserts seed entries
  knex('locations').insert([
    {
      location: 'Trader Joes',
      user_id: 1
    }, {
      location: 'Whole Foods',
      user_id: 1
    }, {
      location: 'HEB',
      user_id: 1
    }, {
      location: 'Starbucks',
      user_id: 1
    }
  ])));
};
