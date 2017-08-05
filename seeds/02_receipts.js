exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(knex('receipts').del().then(() =>
  // Inserts seed entries
  knex('receipts').insert([
    {
      location_id: 1,
      date: '2017-07-29',
      user_id: 1,
    }, {
      location_id: 2,
      date: '2017-07-30',
      user_id: 1,
    }, {
      location_id: 3,
      date: '2017-07-22',
      user_id: 1,
    }, {
      location_id: 1,
      date: '2017-07-22',
      user_id: 1,
    }, {
      location_id: 4,
      date: '2017-07-30',
      user_id: 1,
    },
  ])));
};
