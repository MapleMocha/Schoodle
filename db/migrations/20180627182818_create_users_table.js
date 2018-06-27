
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('users', function(table){
      table.increments('id').primary().unsigned();
      table.string('name');
      table.string('email')
      table.integer('eventId');
      table.foreign('eventId').references('event.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
