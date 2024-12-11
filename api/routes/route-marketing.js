import express from 'express'
import { controller, joi, rules, Exception } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Routes
// -----------------

router.post('/unsubscribe', controller(async ({ body, db }) => {

    const { secret, type } = joi.check(body, {
        secret: rules.uuid,
        type: joi.number().required().valid(0, 1)
    });

    const tables = ['directus_users', 'marketing_list'];
    const success = await db(tables[type]).where({ secret }).$update({ unsubscribe: true });

    if (!success) {
        throw new Exception('INVALID_TOKEN')
    }

}))



// -----------------
// Exports
// -----------------

export default router;