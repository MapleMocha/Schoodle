
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('usersDateOptions', function(table){
      table.integer('dateOptionsId');
      table.foreign('dateOptionsId').references('date_options.id');
      table.integer('usersId');
      table.foreign('usersId').references('users.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('usersDateOptions')
  ]);
};
