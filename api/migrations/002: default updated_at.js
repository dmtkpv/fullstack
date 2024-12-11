// -------------------
// Up
// -------------------

export async function up (knex) {


    // get columns

    const tables = await knex('information_schema.columns')
        .where('table_schema', 'public')
        .where('column_name', 'updated_at')
        .whereNull('column_default')
        .pluck('table_name')

    const hasCreated = await knex('information_schema.columns')
        .where('table_schema', 'public')
        .where('column_name', 'created_at')
        .whereIn('table_name', tables)
        .pluck('table_name')


    // drop views

    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS view_jobs`)
    await knex.raw(`DROP MATERIALIZED VIEW IF EXISTS v_jobs`)
    await knex.raw(`DROP VIEW IF EXISTS v_plans`)
    await knex.raw(`DROP VIEW IF EXISTS v_candidates`)


    // updated_at default

    for (const table of tables) {

        if (!hasCreated.includes(table)) continue;

        await knex(table).whereNull('updated_at').update({
            updated_at: knex.raw('??', 'created_at')
        })

        await knex.schema.alterTable(table, table => {
            table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP')).alter();
        })

    }


}



// -------------------
// Down
// -------------------

export async function down (knex) {
    // nothing to do
}