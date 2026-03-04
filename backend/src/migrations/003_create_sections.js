exports.up = async function(knex) {
  await knex.schema.createTable('sections', table => {
    table.bigIncrements('id').primary();
    table.bigInteger('subject_id').unsigned().notNullable()
      .references('id').inTable('subjects').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.integer('order_index').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['subject_id', 'order_index']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('sections');
};
