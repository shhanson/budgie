exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(() => knex('tags').del().then(() =>
  // Inserts seed entries
  knex('tags').insert([
    {
      tag: 'dessert',
      user_id: 1,
    }, {
      tag: 'coffee',
      user_id: 1,
    }, {
      tag: 'vegetables',
      user_id: 1,
    }, {
      tag: 'dining out',
      user_id: 1,
    }, {
      tag: 'meat',
      user_id: 1,
    }, {
      tag: 'bread',
      user_id: 1,
    }, {
      tag: 'fruits',
      user_id: 1,
    }, {
      tag: 'dairy',
      user_id: 1,
    },
  ])));
};
