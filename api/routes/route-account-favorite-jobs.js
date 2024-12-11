import express from 'express'
import { Exception, controller, schemas, joi, mw, rules } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Middlewares
// -----------------

router.use(mw.role('candidate'));



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, user, db }) => {

    const { limit, page } = joi.check(query, schemas.pager, { required: false })

    return db('favorite_jobs')
        .innerJoin('v_jobs', 'v_jobs.id', 'favorite_jobs.job')
        .where('favorite_jobs.user', user)
        .pager(page, limit)
        .newest()
        .fields('v_jobs', 'item')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ user, db }) => {

    return db('favorite_jobs')
        .where('favorite_jobs.user', user)
        .$count()

}))



// -----------------
// Post
// -----------------

router.post('/', controller(async ({ body, user, db }) => {

    const { job } = joi.check(body, {
        job: rules.id
    })

    const exists = await db('v_jobs').pk(job).$exists();
    if (!exists) throw new Exception('NO_REFERENCE');

    return db('favorite_jobs').$insert({ job, user })

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', controller(async ({ params, user, db }) => {

    const { id } = joi.check(params, schemas.id)

    return db('favorite_jobs')
        .where('user', user)
        .where('id', id)
        .$delete();

}))



// -----------------
// Exports
// -----------------

export default router;