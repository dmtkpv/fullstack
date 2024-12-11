import express from 'express'
import { Exception, controller, schemas, rules, joi, mw } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company', 'member'));



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, company, db }) => {

    const { limit, page } = joi.check(query, schemas.pager, { required: false })

    return db('favorite_users')
        .pager(page, limit)
        .innerJoin('v_candidates', 'v_candidates.id', 'favorite_users.user')
        .where('favorite_users.company', company)
        .newest()
        .fields('v_candidates', 'item')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ company, db }) => {

    return db('favorite_users')
        .where('favorite_users.company', company)
        .$count()

}))



// -----------------
// Post
// -----------------

router.post('/', controller(async ({ body, company, db }) => {

    const { user } = joi.check(body, {
        user: rules.uuid
    })

    const exists = await db('v_candidates').pk(user).$exists();
    if (!exists) throw new Exception('NO_REFERENCE');

    return db('favorite_users').$insert({ company, user, })


}))



// -----------------
// Delete
// -----------------

router.delete('/:id', controller(async ({ params, company, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('favorite_users')
        .where('company', company)
        .where('id', id)
        .$delete()

}))



// -----------------
// Exports
// -----------------

export default router;