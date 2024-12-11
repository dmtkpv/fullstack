import express from 'express'
import { controller, joi, schemas } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Helpers
// -----------------

function getIP (req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

function ignoreDuplication (error) {
    if (error.code !== '23505') return Promise.reject(error);
}


// -----------------
// Jobs
// -----------------

router.post('/jobs', controller(async ({ req, body, db }) => {
    const { id } = joi.check(body, schemas.id);
    return db('jobs_views').$insert({
        job: id,
        ip: getIP(req)
    }).catch(ignoreDuplication)

}))



// -----------------
// User
// -----------------

router.post('/users', controller(async ({ req, body, db }) => {
    const { id } = joi.check(body, schemas.uuid);
    return db('users_views').$insert({
        user: id,
        ip: getIP(req)
    }).catch(ignoreDuplication)
}))



// -----------------
// Exports
// -----------------

export default router;