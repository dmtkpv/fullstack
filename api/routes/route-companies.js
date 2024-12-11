import express from 'express'
import { controller, schemas, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('companies')
        .relation('companies', 'v_plans')
        .pk(id)
        .where(builder => {
            builder.where('companies.is_new', false)
            builder.orWhereNotNull('v_plans.value')
        })
        .select([
            'companies.id',
            'companies.slug',
            'companies.name',
            'companies.phone',
            'companies.website',
            'companies.facebook',
            'companies.about',
            'companies.image'
        ])

}))



// -----------------
// Jobs
// -----------------

router.get('/:id/jobs', controller(async ({ params, query, db }) => {

    const { id } = joi.check(params, schemas.id);
    const { page, limit } = joi.check(query, schemas.pager, { required: false });

    return db('v_jobs')
        .query('v_jobs', 'sort', 1)
        .fields('v_jobs', 'item')
        .where('company', id)
        .pager(page, limit)

}))



// -----------------
// Jobs count
// -----------------

router.get('/:id/jobs/count', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('v_jobs AS jobs')
        .where('company', id)
        .$count()

}))



// -----------------
// Exports
// -----------------

export default router;