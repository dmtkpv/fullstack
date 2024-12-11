import { knex } from '#api/index.js'



// -----------------
// Translations
// -----------------

async function translations () {

    console.log('Deleting unused translations')

    let count = 0;
    const translations = await knex('translations').select('id');

    for (const { id } of translations) {
        await knex('translations')
            .where({ id })
            .del()
            .then(() => count++)
            .catch(e => {})
    }

    console.log(`Deleted ${count} translations`);

}



// -----------------
// Flows logs
// -----------------

async function flows () {
    console.log('Deleting flow logs')
    await knex('directus_revisions').where('collection', 'directus_flows').update('parent', null);
    await knex('directus_revisions').where('collection', 'directus_flows').del();
    await knex('directus_activity').where('collection', 'directus_flows').del();
}



// -----------------
// Exec
// -----------------

await translations();
await flows();
await knex.destroy();