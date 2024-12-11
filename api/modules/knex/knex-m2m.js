import { chunk, omit } from 'lodash-es'



// -------------------
// Omit M2M fields
// -------------------

export function omitM2M (data) {
    const table = this.getTarget();
    const config = this.config.models[table]?.data;
    if (!config) return data;
    const fields = Object.keys(config).filter(key => data[key] !== undefined);
    if (!fields.length) return data;
    if (!this.client.transacting) throw new Error('M2M requires transaction');
    return omit(data, fields);
}



// -------------------
// Run M2M queries
// -------------------

export async function runM2M (pks, data) {

    const table = this.getTarget();
    const config = this.config.models[table]?.data;
    if (!config) return;

    for (const field in config) {
        const { table, fk, pk } = config[field];
        const fks = data[field];
        if (fks === undefined) continue;
        await this.client.queryBuilder().table(table).whereIn(pk, pks).$delete();
        if (!fks.length) continue;
        const items = pks.map(p => fks.map(f => ({ [fk]: f, [pk]: p }))).flat();
        const chunks = chunk(items, 5000);
        for (const chunk of chunks) {
            await this.client.queryBuilder().table(table).$insert(chunk);
        }
    }

}