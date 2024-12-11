export default async function seedViews (knex, config) {



    // -------------------
    // Get current views
    // -------------------

    function applyQuery (qb, type = '') {
        const name = type === 'materialized' ? 'views.matviewname' : 'views.viewname';
        return qb
            .join('pg_class', 'pg_class.relname', name)
            .leftJoin('pg_description', 'pg_description.objoid', 'pg_class.oid')
            .leftJoin('pg_depend', ctx => {
                ctx.on('pg_depend.objid', 'pg_class.oid')
                ctx.on('pg_depend.deptype', qb.client.raw(`'e'`))
            })
            .whereNull('pg_depend.objid')
            .where('views.schemaname', 'public')
            .select(`${name} AS name`)
            .select('pg_description.description AS definition')
            .selectRaw(`? AS type`, type)
    }

    const views = [
        knex('pg_views AS views').modify(applyQuery),
        knex('pg_catalog.pg_matviews AS views').modify(applyQuery, 'materialized')
    ]



    // -------------------
    // Drop unused
    // -------------------

    const current = await knex.union(views);

    for (const { name, type, definition } of current) {
        const view = config[name];
        if (!view || view.type !== type || view.definition !== definition) {
            console.log('DROP VIEW:', name);
            await knex.raw(`DROP ${type} VIEW ${name} CASCADE`);
        }
    }



    // -------------------
    // Create new
    // -------------------

    const unchanged = await knex.union(views);

    for (const name in config) {
        const exists = unchanged.find(row => row.name === name);
        if (exists) continue;
        console.log('CREATE VIEW:', name)
        const { type, definition, onCreate } = config[name];
        await knex.raw(`CREATE ${type} VIEW ${name} AS ${definition}`);
        await knex.raw(`COMMENT ON ${type} VIEW ${name} IS $$${definition}$$`);
        await onCreate?.(knex);
    }



}