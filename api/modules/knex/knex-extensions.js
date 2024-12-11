import { omitM2M, runM2M } from './knex-m2m.js'

export default {



    // -------------------
    // Data
    // -------------------

    getTarget () {
        return this._single.table.split(' ').pop();
    },

    getSchema () {
        const table = this.getTarget();
        return this.config.schema[table] ?? { table, pk: 'id' };
    },

    getPK () {
        const { table, pk } = this.getSchema();
        return `${table}.${pk}`;
    },

    getFields (model, key) {
        const fn = this.config.models[model]?.fields?.[key];
        if (!fn) throw new Error(`${model}.fields.${key} not found`);
        return fn.apply(this);
    },

    toJSON (name, fields) { // unsafe (no bindings)
        const bindings = fields.flatMap(field => {
            let [value, alias] = field.split(/ AS /i);
            if (!alias) alias = value.split('.').pop();
            return [`'${alias}'`, value]
        })
        return this.client.raw(`JSONB_BUILD_OBJECT(${bindings.join(', ')}) AS ${name}`);
    },



    // -------------------
    // Filters
    // -------------------

    pk (pk) {
        return this.where(this.getPK(), pk).first();
    },

    pager (page, limit) {
        return this.limit(limit).offset(limit * (page - 1));
    },



    // -------------------
    // Helpers
    // -------------------

    newest (field = 'updated_at') {
        return this.orderBy(`${this.getTarget()}.${field}`, 'desc')
    },

    selectRaw (sql, bindings) {
        return this.select(this.client.raw(sql, bindings))
    },

    selectJSON (name, fields) {
        return this.select(this.toJSON(name, fields));
    },

    exists (exists = true) {
        return this.client.queryBuilder().select(this.client.raw(`${exists ? 'EXISTS' : 'NOT EXISTS'} ? AS value`, this));
    },



    // -------------------
    // Custom
    // -------------------

    query (model, key, ...args) {
        const fn = this.config.models[model]?.queries?.[key];
        if (!fn) throw new Error(`${model}.queries.${key} not found`);
        return fn.apply(this, args);
    },

    relation (model, key, ...args) {
        const target = this.getTarget();
        this.relations ??= [target];
        if (this.relations.includes(key)) return this;
        const fn = this.config.models[model]?.relations?.[key];
        if (!fn) throw new Error(`${model}.relations.${key} not found`);
        this.relations.push(key);
        return fn.apply(this, args);
    },

    fields (model, key) {
        return this.select(this.getFields(model, key))
    },



    // -------------------
    // Unchained
    // -------------------

    async $insert (data, returning = []) {
        const { user } = this.userParams;
        const { pk, columns } = this.getSchema();
        const arr = Array.isArray(data);
        const datas = [data].flat();
        const body = datas.map(data => {
            if (columns.created_by) data.created_by ??= user;
            return omitM2M.call(this, data);
        })
        const rows = await this.insert(body, [pk, ...returning]);
        const m2m = rows.map((row, index) => runM2M.call(this, [row[pk]], datas[index], user));
        await Promise.all(m2m);
        return arr ? rows : rows[0];
    },

    async $update (data, returning = []) {
        const { user } = this.userParams;
        const { pk, columns } = this.getSchema();
        if (columns.updated_by) data.updated_by ??= user;
        if (columns.updated_at) data.updated_at ??= new Date();
        const body = omitM2M.call(this, data);
        const rows = await this.update(body, [pk, ...returning]);
        const pks = rows.map(item => item[pk]);
        await runM2M.call(this, pks, data, user);
        return rows;
    },

    $delete (...args) {
        return this.delete(...args);
    },

    $count () {
        return this.countDistinct(`${this.getPK()} AS count`).first().then(({ count }) => count);
    },

    $exists (exists) {
        return this.exists(exists).first().then(({ value }) => value);
    }


}