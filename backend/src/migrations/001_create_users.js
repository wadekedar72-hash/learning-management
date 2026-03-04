exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.bigIncrements('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('name', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index('email');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
