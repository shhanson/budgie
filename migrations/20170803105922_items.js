exports.up = function (knex, Promise) {
  return knex.schema.createTable('tags', (table) => {
    table.increments('id');
    table.string('tag').notNullable().unique();
    table.integer('user_id');
    table.timestamps(true, true);
  }).createTable('items', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.decimal('price');
    table.integer('receipt_id').notNullable();
    table.foreign('receipt_id').references('id').inTable('receipts').onDelete('CASCADE');
    table.integer('tag_id');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
    table.timestamps(true, true);
  }).then(() => {
    knex.raw('ALTER SEQUENCE tags_id_seq RESTART WITH 1').then(() => {
      knex.raw('ALTER SEQUENCE items_id_seq RESTART WITH 1');
    });
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('items').dropTable('tags');
};
