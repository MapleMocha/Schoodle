
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('date_options', function(table){
      table.increments('id').primary().unsigned();
      table.date('date');
      table.time('timeStart');
      table.time('timeEnd');
      table.integer('eventId');
      table.foreign('eventId').references('event.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('date_options')
  ]);
};
