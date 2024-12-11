import express from 'express'
import { omit, pick } from 'lodash-es'
import { FILTERS_JOBS } from '@vacature/shared/constants.js'
import { controller, schemas, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schemaSort = {
    sort: joi.number().valid(1, 2, 3, 4)
}

const schemaFilter = {
    search: joi.string(),
    branch: joi.number().natural(),
    education_field: joi.number().natural(),
    education_level: joi.number().natural(),
    education_path: joi.number().natural(),
    date: joi.date().iso(),
    distance: joi.number().natural(),
    location: joi.object({
        lat: joi.number().max(90).min(-90).required(),
        lng: joi.number().max(180).min(-180).required(),
    })
}



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, db }) => {

    const input = joi.check(query, {
        ...schemaSort,
        ...schemaFilter,
        ...schemas.pager,
    }, { required: false })

    const { page, limit, sort, ...filter } = input;
    const { location } = filter;

    return db('v_jobs')
        .pager(page, limit)
        .query('v_jobs', 'filter', filter)
        .query('v_jobs', 'sort', sort, location)
        .fields('v_jobs', 'item')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const input = joi.check(query, schemaFilter, { required: false });
    const common = omit(input, Object.values(FILTERS_JOBS));
    const custom = pick(input, Object.values(FILTERS_JOBS));

    const jobs = db('v_jobs')
        .query('v_jobs', 'filter', common)
        .select('id')
        .select(Object.keys(FILTERS_JOBS));

    const filters = Object.keys(FILTERS_JOBS).map(list => {
        const filter = omit(custom, FILTERS_JOBS[list]);
        return db('v_jobs')
            .query('v_jobs', 'filter', filter)
            .groupBy('value')
            .select([
                db.raw(`? as list`, list),
                db.raw(`COUNT(id) as total`),
                db.raw(`unnest(??) AS value`, list),
            ])
    })

    const total = db('v_jobs')
        .query('v_jobs', 'filter', custom)
        .select([
            db.raw(`'total' as list`),
            db.raw(`COUNT(id) as total`),
            db.raw(`0 AS value`),
        ])

    const raw = await db.with('v_jobs', jobs).unionAll([...filters, total]);
    const data = raw.reduce((data, { list, value, total }) => {
        data[list] ??= {};
        data[list][value] = total;
        return data;
    }, {})

    data.total = data.total[0];
    return data;

}))



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('v_jobs')
        .pk(id)
        .fields('v_jobs', 'item')

}))



// -----------------
// Details
// -----------------

router.get('/:id/details', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('v_jobs')
        .fields('v_jobs', 'details')
        .pk(id)

}))



// -----------------
// Exports
// -----------------

export default router;