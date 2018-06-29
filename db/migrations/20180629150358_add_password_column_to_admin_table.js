
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.table('admin', function(table){
      table.text('password');
   })
 ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('admin', function(table){
      table.dropColumn('password');
    })
  ]);
};
