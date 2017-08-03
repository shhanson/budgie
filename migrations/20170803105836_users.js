exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first').notNullable();
    table.string('last').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
