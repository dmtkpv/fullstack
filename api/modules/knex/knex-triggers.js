import crypto from 'crypto'

export default async function seedTriggers (knex, config) {



    // -------------------
    // Data
    // -------------------

    const PREFIX = 'knex_tg_';
    const functions = {}
    const definitions = {}



    // -------------------
    // Helpers
    // -------------------

    function getName (string) {
        return PREFIX + crypto.createHash('md5').update(string).digest('hex')
    }



    // -------------------
    // Generate data
    // -------------------

    for (const trigger of config) {
        const fnName = getName(trigger.function);
        const def = trigger.definition + `\nEXECUTE FUNCTION ${fnName}()`;
        functions[fnName] ??= trigger.function;
        definitions[getName(def)] ??= def;
    }



    // -------------------
    // Update functions
    // -------------------

    const currFunctions = await knex('pg_proc')
        .where('proname', 'like', `${PREFIX}%`)
        .pluck('proname')

    const delFunctions = currFunctions.filter(name => {
        return !functions[name];
    })

    const addFunctions = Object.keys(functions).filter(name => {
        return !currFunctions.includes(name);
    })

    for (const name of delFunctions) {
        await knex.raw(`
            DROP FUNCTION ${name} CASCADE
        `)
    }

    for (const name of addFunctions) {
        await knex.raw(`
            CREATE FUNCTION ${name}()
            RETURNS TRIGGER AS $$
            ${functions[name]}
            $$ LANGUAGE plpgsql;
        `)
    }



    // -------------------
    // Update definitions
    // -------------------

    const triggers = await knex('pg_trigger')
        .innerJoin('pg_class', 'pg_class.oid', 'pg_trigger.tgrelid')
        .where('tgname', 'like', `${PREFIX}%`)
        .select([
            'tgname AS name',
            'pg_class.relname AS table'
        ])


    const currDefinitions = triggers.map(trigger => {
        return trigger.name;
    })

    const delDefinitions = currDefinitions.filter(name => {
        return !definitions[name];
    })

    const addDefinitions = Object.keys(definitions).filter(name => {
        return !currDefinitions.includes(name);
    })

    for (const name of delDefinitions) {
        const { table } = triggers.find(trigger => trigger.name === name)
        await knex.raw(`DROP TRIGGER ${name} ON ${table} CASCADE`)
    }

    for (const name of addDefinitions) {
        await knex.raw(`
            CREATE TRIGGER ${name}
            ${definitions[name]}
        `)
    }



}