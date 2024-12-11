// -----------------
// Get domain
// -----------------

export function getDomain (url) {
    const { hostname } = new URL(url);
    if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) return hostname; // IP
    return hostname.split('.').reverse().splice(0,2).reverse().join('.');
}



// -----------------
// Slugify
// -----------------

export function slugify (str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').replace(/--+/g, '-');
}



// -----------------
// Sleep
// -----------------

export function sleep (time = 300) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}



// --------------------------------
// Executes fn(param) one at time
// --------------------------------

export function createQueue (fn, delay) {

    let pending = false;
    let queue = [];

    async function exec () {
        const params = queue.shift();
        if (!params) return;
        pending = true;
        try { await fn(JSON.parse(params)) }
        catch (e) { console.log(`QUEUE FAILED \n${fn} \n${params}`, e)}
        if (delay) await sleep(delay);
        pending = false;
        exec();
    }

    return (params) => {
        const json = JSON.stringify(params) ?? '{}';
        const exists = queue.find(j => j === json);
        if (!exists) queue.push(json);
        if (!pending) exec();
    };

}



// -----------------
// Set sequence
// -----------------

export async function setSequence (knex) {

    const items = await knex('information_schema.table_constraints AS tc')
        .join('information_schema.key_column_usage AS kcu', 'kcu.constraint_name', 'tc.constraint_name')
        .where('tc.constraint_type', 'PRIMARY KEY')
        .where('tc.table_schema', 'public')
        .select('kcu.table_name AS table')
        .select('kcu.column_name AS pk')
        .select(knex.raw(`pg_get_serial_sequence(tc.table_name, kcu.column_name) as sequence`));

    for (const { pk, sequence, table } of items) {
        if (!sequence) continue;
        await knex.raw(`SELECT setval(?, (SELECT MAX(??) from ??))`, [sequence, pk, table])
    }

}


