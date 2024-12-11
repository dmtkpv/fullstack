import createUtils from './utils/001.js'



// -------------------
// Up
// -------------------

export async function up (knex) {

    const $ = createUtils(knex);

    await knex.schema.alterTable('directus_users', table => {
        // to track updated_at
        // and m2m not working without system columns
        $.setDefaults(table);
    })
    

}



// -------------------
// Down
// -------------------

export async function down (knex) {

    const $ = createUtils(knex);

    await knex.schema.alterTable('directus_users', table => {
        $.dropDefaults(table);
    })

}