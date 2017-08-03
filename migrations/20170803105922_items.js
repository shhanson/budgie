exports.up = function (knex, Promise) {
  return knex.schema.createTable('items', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.decimal('price');
    table.integer('receipt_id').notNullable();
    table.foreign('receipt_id').references('id').inTable('receipts');
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('items');
};
