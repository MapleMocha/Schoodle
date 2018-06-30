
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.table('event', function(table){
      table.text('uniqueURL');
   })
 ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('event', function(table){
      table.dropColumn('uniqueURL');
    })
  ]);
};
