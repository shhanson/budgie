exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del().then(() =>
  // Inserts seed entries
  knex('items').insert([
    {
      name: 'mango',
      price: 2.99,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'organic mango',
      price: 9.99,
      receipt_id: 2,
      tag_id: 7,
    }, {
      name: 'milk',
      price: 3.99,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'bread',
      price: 2.99,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'dark chocolate',
      price: 8.99,
      receipt_id: 2,
      tag_id: 7,
    }, {
      name: 'mango',
      price: 2.99,
      receipt_id: 4,
      tag_id: 7,
    }, {
      name: 'milk',
      price: 3.99,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'jam',
      price: 6.99,
      receipt_id: 2,
      tag_id: 7,
    }, {
      name: 'edamame',
      price: 4.99,
      receipt_id: 4,
      tag_id: 7,
    }, {
      name: 'apples',
      price: 2.99,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'salmon',
      price: 19.99,
      receipt_id: 2,
      tag_id: 7,
    }, {
      name: 'iced latte',
      price: 5.41,
      receipt_id: 5,
      tag_id: 7,
    }, {
      name: 'celery',
      price: 1.64,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'sweet potato chips',
      price: 2.06,
      receipt_id: 4,
      tag_id: 7,
    }, {
      name: 'ice cream',
      price: 4.52,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'toilet paper',
      price: 6.99,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'ice cream',
      price: 5.99,
      receipt_id: 2,
      tag_id: 7,
    }, {
      name: 'turkey',
      price: 2.99,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'drip coffee',
      price: 2.59,
      receipt_id: 5,
      tag_id: 7,
    }, {
      name: 'snap peas',
      price: 3.91,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'peanut butter',
      price: 4.12,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'oranges',
      price: 2.99,
      receipt_id: 1,
      tag_id: 7,
    }, {
      name: 'cat food',
      price: 10.91,
      receipt_id: 3,
      tag_id: 7,
    }, {
      name: 'cookies',
      price: 2.99,
      receipt_id: 4,
      tag_id: 7,
    }, {
      name: 'chocolate peanut butter cups',
      price: 2.99,
      receipt_id: 4,
      tag_id: 1,
    },
  ]));
};
