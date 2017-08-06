exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(() => knex('tags').del().then(() =>
  // Inserts seed entries
  knex('tags').insert([
    {
      name: 'dessert',
      user_id: 1
    }, {
      name: 'coffee',
      user_id: 1
    }, {
      name: 'vegetables',
      user_id: 1
    }, {
      name: 'dining out',
      user_id: 1
    }, {
      name: 'meat',
      user_id: 1
    }, {
      name: 'bread',
      user_id: 1
    }, {
      name: 'fruits',
      user_id: 1
    }, {
      name: 'dairy',
      user_id: 1
    }
  ])));
};
