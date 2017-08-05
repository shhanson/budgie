exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(() => knex('tags').del().then(() =>
  // Inserts seed entries
  knex('tags').insert([
    {
      name: 'dessert',
    }, {
      name: 'coffee',
    }, {
      name: 'vegetables',
    }, {
      name: 'dining out',
    }, {
      name: 'meat',
    }, {
      name: 'bread',
    }, {
      name: 'fruits',
    }, {
      name: 'dairy',
    },
  ])));
};
