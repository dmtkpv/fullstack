import express from 'express'
import { omit, pick } from 'lodash-es'
import { FILTERS_CANDIDATES } from '@vacature/shared/constants.js'
import { Exception, controller, schemas, joi, mw } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    search: joi.string(),
    education_level: joi.number().natural(),
    education_field: joi.number().natural(),
    gender: joi.number().natural()
}



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company', 'member'));



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, company, db }) => {

    const plan = await db('v_plans').where({ company }).first();
    if (plan?.value !== 3) throw new Exception('UNPAID');

    const input = joi.check(query, {
        ...schema,
        ...schemas.pager,
    }, { required: false })

    const { page, limit, ...filter } = input;

    return db('v_candidates')
        .pager(page, limit)
        .query('v_candidates', 'filter', filter)
        .fields('v_candidates', 'item')
        .newest('last_access')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const input = joi.check(query, schema, { required: false });
    const common = omit(input, Object.values(FILTERS_CANDIDATES));
    const custom = pick(input, Object.values(FILTERS_CANDIDATES));

    const users = db('v_candidates')
        .query('v_candidates', 'filter', common)
        .select('v_candidates.id')
        .select(Object.values(FILTERS_CANDIDATES));

    const filters = Object.keys(FILTERS_CANDIDATES).map(list => {
        const column = FILTERS_CANDIDATES[list];
        const filter = omit(custom, column);
        return db('v_candidates')
            .query('v_candidates', 'filter', filter)
            .whereNotNull(column)
            .groupBy('value')
            .select([
                db.raw(`? as list`, list),
                db.raw(`COUNT(id) as total`),
                db.raw(`?? AS value`, column),
            ])
    })

    const total = db('v_candidates')
        .query('v_candidates', 'filter', custom)
        .select([
            db.raw(`'total' as list`),
            db.raw(`COUNT(id) as total`),
            db.raw(`0 AS value`),
        ])

    const raw = await db.with('v_candidates', users).unionAll([...filters, total]);
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

    const { id } = joi.check(params, schemas.uuid);

    return db('v_candidates')
        .relation('v_candidates', 'v_cvs')
        .fields('v_candidates', 'item')
        .pk(id)
        .select([
            'v_candidates.phone',
            db.raw('COALESCE(v_cvs.cv, v_candidates.cv) AS cv')
        ])

}))



// -----------------
// CV
// -----------------

router.get('/:id/cv', controller(async ({ params, company, db }) => {

    const { id } = joi.check(params, schemas.uuid);

    return db('v_candidates')
        .leftJoin('rooms', ctx => {
            ctx.on('rooms.candidate', 'v_candidates.id')
            ctx.on('rooms.company', db.raw('?', company))
            ctx.onNotNull('rooms.job')
        })
        .leftJoin('applications', ctx => {
            ctx.on('applications.room', 'rooms.id')
            ctx.onNotNull('applications.cv')
        })
        .orderBy('applications.created_at', 'desc', 'last')
        .selectRaw('COALESCE(applications.cv, v_candidates.cv) AS id')
        .pk(id)

}))




// -----------------
// Exports
// -----------------

export default router;