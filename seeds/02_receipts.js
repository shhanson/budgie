exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(knex('receipts').del().then(() =>
  // Inserts seed entries
  knex('receipts').insert([
    {
      location: 'Trader Joes',
      date: '2017-07-29',
      user_id: 1
    }, {
      location: 'Whole Foods',
      date: '2017-07-30',
      user_id: 1
    }, {
      location: 'HEB',
      date: '2017-07-22',
      user_id: 1
    }, {
      location: 'Trader Joes',
      date: '2017-07-22',
      user_id: 1
    }, {
      location: 'Starbucks',
      date: '2017-07-30',
      user_id: 1
    }
  ])));
};
