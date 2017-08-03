exports.up = function (knex, Promise) {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id');
    table.string('location').notNullable().unique();
    table.timestamps(true, true);
  }).createTable('receipts', (table) => {
    table.increments('id');
    table.integer('location_id').notNullable();
    table.foreign('location_id').references('locations.id');
    table.string('date').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('receipts').dropTable('locations');
};
