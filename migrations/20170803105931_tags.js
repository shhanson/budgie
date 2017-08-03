exports.up = function (knex, Promise) {
  return knex.schema.createTable('tags', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tags');
};
