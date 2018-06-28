
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('admin', function(table){
      table.increments('id').primary().unsigned();
      table.string('name');
      table.string('email');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('admin')
  ]);
};
