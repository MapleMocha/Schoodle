
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('event', function(table){
      table.increments('id').primary().unsigned();
      table.string('name');
      table.integer('adminId');
      table.foreign('adminId').references('admin.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('event')
  ]);
};
