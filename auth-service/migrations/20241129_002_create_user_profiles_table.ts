import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_profiles', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name', 100).nullable();
    table.string('last_name', 100).nullable();
    table.string('display_name', 100).nullable();
    table.string('avatar_url', 500).nullable();
    table.text('bio').nullable();
    table.date('date_of_birth').nullable();
    table.string('city', 100).nullable();
    table.string('country', 100).nullable();
    table.decimal('location_lat', 10, 8).nullable();
    table.decimal('location_lng', 11, 8).nullable();
    table.string('timezone', 50).defaultTo('UTC');
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_profiles');
}