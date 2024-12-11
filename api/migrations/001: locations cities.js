// -------------------
// Up
// -------------------

export async function up (knex) {
    await knex.raw(`
        ALTER TABLE locations
        ADD COLUMN city_en TEXT GENERATED ALWAYS AS (COALESCE(components_en->>'locality', components_en->>'region', address_en)) STORED,
        ADD COLUMN city_nl TEXT GENERATED ALWAYS AS (COALESCE(components_nl->>'locality', components_nl->>'region', address_nl)) STORED
    `)
}



// -------------------
// Down
// -------------------

export async function down (knex) {
    await knex.raw(`ALTER TABLE locations DROP COLUMN city_en, DROP COLUMN city_nl`);
}