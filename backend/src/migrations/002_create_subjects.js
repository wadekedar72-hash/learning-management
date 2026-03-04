exports.up = async function(knex) {
  await knex.schema.createTable('subjects', table => {
    table.bigIncrements('id').primary();
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description');
    table.boolean('is_published').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index('slug');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('subjects');
};
