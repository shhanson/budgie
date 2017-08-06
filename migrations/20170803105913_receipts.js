exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id');
    table.string('location').notNullable().unique();
    table.integer('user_id');
    table.timestamps(true, true);
  }).createTable('receipts', (table) => {
    table.increments('id');
    table.integer('location_id').notNullable();
    table.foreign('location_id').references('locations.id').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  }).then(() => {
    knex.raw('ALTER SEQUENCE locations_id_seq RESTART WITH 1').then(() => {
      knex.raw('ALTER SEQUENCE receipts_id_seq RESTART WITH 1');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('receipts').dropTable('locations');
};
