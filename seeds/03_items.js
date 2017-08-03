exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('receipts').del().then(knex('items').del().then(() =>
  // Inserts seed entries
  knex('items').insert([
    {
      name: 'mango',
      price: 2.99,
      receipt_id: 1,
    }, {
      name: 'organic mango',
      price: 9.99,
      receipt_id: 2,
    }, {
      name: 'milk',
      price: 3.99,
      receipt_id: 1,
    }, {
      name: 'bread',
      price: 2.99,
      receipt_id: 1,
    }, {
      name: 'dark chocolate',
      price: 8.99,
      receipt_id: 2,
    }, {
      name: 'mango',
      price: 2.99,
      receipt_id: 4,
    }, {
      name: 'milk',
      price: 3.99,
      receipt_id: 3,
    }, {
      name: 'jam',
      price: 6.99,
      receipt_id: 2,
    }, {
      name: 'edamame',
      price: 4.99,
      receipt_id: 4,
    }, {
      name: 'apples',
      price: 2.99,
      receipt_id: 1,
    }, {
      name: 'salmon',
      price: 19.99,
      receipt_id: 2,
    }, {
      name: 'iced latte',
      price: 5.41,
      receipt_id: 5,
    }, {
      name: 'celery',
      price: 1.64,
      receipt_id: 3,
    }, {
      name: 'sweet potato chips',
      price: 2.06,
      receipt_id: 4,
    }, {
      name: 'ice cream',
      price: 4.52,
      receipt_id: 3,
    }, {
      name: 'toilet paper',
      price: 6.99,
      receipt_id: 3,
    }, {
      name: 'ice cream',
      price: 5.99,
      receipt_id: 2,
    }, {
      name: 'turkey',
      price: 2.99,
      receipt_id: 3,
    }, {
      name: 'drip coffee',
      price: 2.59,
      receipt_id: 5,
    }, {
      name: 'snap peas',
      price: 3.91,
      receipt_id: 1,
    }, {
      name: 'peanut butter',
      price: 4.12,
      receipt_id: 1,
    }, {
      name: 'oranges',
      price: 2.99,
      receipt_id: 1,
    }, {
      name: 'cat food',
      price: 10.91,
      receipt_id: 3,
    }, {
      name: 'cookies',
      price: 2.99,
      receipt_id: 4,
    }, {
      name: 'chocolate peanut butter cups',
      price: 2.99,
      receipt_id: 4,
    },
  ])));
};
