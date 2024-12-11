import express from 'express'
import { Exception, controller, schemas, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    status: joi.string().valid('PENDING', 'APPROVED', 'REJECTED'),
    job: joi.number().natural(),
    search: joi.string().when('job', {
        is: joi.exist(),
        then: joi.forbidden(),
    })
}



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, db }) => {

    const { page, limit, ...filter } = joi.check(query, {
        ...schema,
        ...schemas.pager,
    }, { required: false })

    return db('applications')
        .query('applications', 'filter', filter)
        .relation('applications', 'rooms')
        .fields('rooms', 'item')
        .newest()
        .pager(page, limit)
        .select([
            'applications.id',
            'applications.room',
            'applications.status',
            'applications.updated_at',
        ])

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const filter = joi.check(query, schema, { required: false })

    return db('applications')
        .query('applications', 'filter', filter)
        .$count()

}))



// -----------------
// Jobs
// -----------------

router.get('/jobs', controller(async ({ db }) => {

    return db('applications')
        .query('applications', 'filter')
        .relation('applications', 'rooms')
        .relation('rooms', 'jobs')
        .distinctOn('jobs.id')
        .select([
            'jobs.id AS value',
            'jobs.title AS text'
        ])

}))



// -----------------
// Jobs
// -----------------

router.delete('/:id', controller(async ({ params, type, db }) => {

    const { id } = joi.check(params, schemas.id);

    const exists = await db('applications').query('applications', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    return db('applications').pk(id).$update({
        [`${type}_archived`]: true
    })

}))



// -----------------
// Exports
// -----------------

export default router;