import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_settings', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('language', 10).defaultTo('en');
    table.string('currency', 3).defaultTo('NGN');
    table.string('distance_unit', 10).defaultTo('km');
    table.integer('default_search_radius').defaultTo(25);
    table.boolean('email_marketing').defaultTo(true);
    table.boolean('email_reminders').defaultTo(true);
    table.boolean('push_enabled').defaultTo(true);
    table.boolean('sms_enabled').defaultTo(false);
    table.specificType('favorite_categories', 'UUID[]').defaultTo('{}');
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_settings');
}