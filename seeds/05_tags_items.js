exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags').del().then(knex('items').del().then(knex('tags_items').del().then(() =>
  // Inserts seed entries
  knex('tags_items').insert([
    {
      tag_id: 7,
      item_id: 1,
    }, {
      tag_id: 7,
      item_id: 2,
    }, {
      tag_id: 8,
      item_id: 3,
    }, {
      tag_id: 6,
      item_id: 4,
    }, {
      tag_id: 1,
      item_id: 5,
    }, {
      tag_id: 7,
      item_id: 6,
    }, {
      tag_id: 8,
      item_id: 7,
    }, {
      tag_id: 1,
      item_id: 8,
    }, {
      tag_id: 3,
      item_id: 9,
    }, {
      tag_id: 7,
      item_id: 10,
    }, {
      tag_id: 5,
      item_id: 11,
    }, {
      tag_id: 2,
      item_id: 12,
    }, {
      tag_id: 3,
      item_id: 13,
    }, {
      tag_id: 3,
      item_id: 14,
    }, {
      tag_id: 1,
      item_id: 15,
    }, {
      tag_id: 6,
      item_id: 16,
    }, {
      tag_id: 1,
      item_id: 17,
    }, {
      tag_id: 5,
      item_id: 18,
    }, {
      tag_id: 2,
      item_id: 19,
    }, {
      tag_id: 3,
      item_id: 20,
    }, {
      tag_id: 1,
      item_id: 21,
    }, {
      tag_id: 7,
      item_id: 22,
    }, {
      tag_id: 1,
      item_id: 23,
    }, {
      tag_id: 1,
      item_id: 24,
    }, {
      tag_id: 1,
      item_id: 25,
    },
  ]))));
};
