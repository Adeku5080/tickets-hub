import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_verifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('type', 20).notNullable(); // 'seller' or 'organizer'
    table.string('status', 20).defaultTo('pending'); // pending, approved, rejected
    table.string('document_url', 500).nullable();
    table.timestamp('submitted_at').defaultTo(knex.fn.now());
    table.timestamp('reviewed_at').nullable();
    table.uuid('reviewed_by').references('id').inTable('users').nullable();
    table.text('rejection_reason').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_verifications');
}