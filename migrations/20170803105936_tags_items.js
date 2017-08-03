exports.up = function (knex, Promise) {
  return knex.schema.createTable('tags_items', (table) => {
    table.increments('id');
    table.integer('tag_id').notNullable();
    table.foreign('tag_id').references('id').inTable('tags');
    table.integer('item_id').notNullable();
    table.foreign('item_id').references('id').inTable('items');
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tags_items');
};
