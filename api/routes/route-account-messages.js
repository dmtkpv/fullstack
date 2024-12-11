import express from 'express'
import { controller, joi, schemas } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    room: joi.number().natural(),
    read: joi.boolean(),
    notification: joi.boolean().default(false)
}



// -----------------
// List
// -----------------

router.get('/', controller(async ({ type, db, query }) => {

    const { page, limit, ...filter } = joi.check(query, {
        ...schema,
        ...schemas.pager
    }, { required: false })

    const qb = db('messages')
        .query('messages', 'filter', filter)
        .pager(page, limit)

    if (filter.notification) qb
        .newest()
        .fields('rooms', 'item')
        .select([
            'messages.id',
            'messages.room',
            'messages.template',
            'messages.created_at',
            `rooms.${type}_visited_at AS visited_at`
        ])

    else qb
        .fields('messages', 'item')
        .orderBy('messages.created_at')

    return qb;

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ db, query }) => {

    const filter = joi.check(query, schema, { required: false })

    return db('messages')
        .query('messages', 'filter', filter)
        .$count()

}))



// -----------------
// Create
// -----------------

router.post('/', controller(async ({ body, rooms }) => {
    return rooms.message(body);
}))



// -----------------
// Exports
// -----------------

export default router;