export default function useUtils (knex) {



    // -------------------
    // Schema
    // -------------------

    function setDefaults (table) {
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.uuid('created_by').references('directus_users.id').onDelete('SET NULL');
        table.uuid('updated_by').references('directus_users.id').onDelete('SET NULL');
    }

    function dropDefaults (table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('created_by');
        table.dropColumn('updated_by');
    }




    // -------------------
    // Translations
    // -------------------

    function getTranslation ([en, nl]) {
        return knex('translations').where({ en, nl }).first().select('id');
    }

    async function createTranslation ([en, nl]) {
        const exists = await getTranslation([en, nl]);
        if (exists) return exists.id;
        const [translation] = await knex('translations').insert({ en, nl }).returning('id');
        return translation.id;
    }




    // -------------------
    // Routes
    // -------------------

    async function createRoute ({ name, parent, path, title, description = 797 }) {
        if (Array.isArray(path)) path = await createTranslation(path);
        if (Array.isArray(title)) title = await createTranslation(title);
        if (Array.isArray(description)) description = await createTranslation(description);
        return knex('routes').insert({ name, parent, path, title, description })
    }

    function removeRoute (name) {
        return knex('routes').where({ name }).del();
    }



    // -------------------
    // Components
    // -------------------

    async function createComponent (component) {
        const exists = await knex('texts').where({ component }).first();
        if (!exists) await knex('texts').insert({ component });
    }

    async function removeComponent (component) {
        await knex('texts_translations').where({ component }).del();
        await knex('texts').where({ component }).del();
    }

    async function renameComponent (component, to) {
        await createComponent(to);
        await knex('texts_translations').where({ component }).update({ component: to });
        await removeComponent(component);
    }



    // -------------------
    // Texts
    // -------------------

    async function createText (component, key, translation) {
        if (Array.isArray(translation)) translation = await createTranslation(translation);
        await knex('texts_translations').insert({ component, key, translation })
    }

    function removeText (component, key) {
        return knex('texts_translations').where({ component, key }).del();
    }

    function renameText (component, key, to) {
        return knex('texts_translations').where({ component, key }).update({ key: to })
    }

    async function copyText (component, key, to) {
        const { translation } = await knex('texts_translations').where({ component, key }).select('translation').first();
        return createText(to, key, translation);
    }



    // -------------------
    // Export
    // -------------------

    return {
        setDefaults,
        dropDefaults,
        createTranslation,
        createRoute,
        removeRoute,
        createComponent,
        removeComponent,
        renameComponent,
        createText,
        removeText,
        renameText,
        copyText
    }


}