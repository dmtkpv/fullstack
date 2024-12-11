export default async function getSchema (knex) {

    const columns = await knex('information_schema.columns AS columns')
        .innerJoin('information_schema.tables AS tables', ctx => {
            ctx.on('tables.table_name', 'columns.table_name')
            ctx.on('tables.table_schema', knex.raw('?', 'public'))
            ctx.on('tables.table_type', knex.raw('?', 'BASE TABLE'))
        })
        .groupBy('columns.table_name')
        .select(['columns.table_name AS table', knex.raw('json_object_agg(columns.column_name, columns.data_type) as columns')])

    const pks = await knex('information_schema.table_constraints AS tc')
        .join('information_schema.key_column_usage AS kcu', 'kcu.constraint_name', 'tc.constraint_name')
        .where('tc.constraint_type', 'PRIMARY KEY')
        .where('kcu.table_schema', 'public')
        .select('kcu.table_name AS table', 'kcu.column_name AS pk');

    return columns.reduce((schema, { table, columns }) => {
        const { pk } = pks.find(item => item.table === table) ?? {};
        schema[table] = { table, pk, columns };
        return schema;
    }, {})

}