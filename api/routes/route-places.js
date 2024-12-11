import express from 'express'
import { controller } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, locale, places }) => {
    return places.search({ ...query, locale })
}))



// -----------------
// Item
// -----------------

router.get('/:place_id', controller(async ({ query, params, locale, places }) => {
    return places.info({ ...query, ...params, locale })
}))



// -----------------
// Exports
// -----------------

export default router;