import bcrypt from 'bcrypt'
import express from 'express'
import { ROLES } from '@vacature/shared/constants.js'
import Profile from './route-account-profile.js'
import Company from './route-account-company.js'
import Locations from './route-account-locations.js'
import JobImages from './route-account-job-images.js'
import Jobs from './route-account-jobs.js'
import Members from './route-account-members.js'
import FavoriteJobs from './route-account-favorite-jobs.js'
import FavoriteUsers from './route-account-favorite-users.js'
import Applications from './route-account-applications.js'
import Messages from './route-account-messages.js'
import CVs from './route-account-cvs.js'
import Rooms from './route-account-rooms.js'
import { Exception, controller, schemas, joi, mw } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Middlewares
// -----------------

router.use(mw.authorized())



// -----------------
// Routes
// -----------------

router.use('/profile', Profile)
router.use('/company', Company)
router.use('/locations', Locations)
router.use('/jobs', Jobs)
router.use('/job-images', JobImages)
router.use('/members', Members)
router.use('/favorite-jobs', FavoriteJobs)
router.use('/favorite-users', FavoriteUsers)
router.use('/applications', Applications)
router.use('/cvs', CVs)
router.use('/messages', Messages)
router.use('/rooms', Rooms)



// -----------------
// Me
// -----------------

router.get('/me', controller(async ({ user, db, type }) => {

    const data = await db('directus_users')
        .leftJoin('companies', 'companies.id', 'directus_users.company')
        .leftJoin('v_plans', 'v_plans.company', 'companies.id')
        .pk(user)
        .select([
            'directus_users.id',
            'directus_users.role',
            'directus_users.avatar',
            'directus_users.first_name',
            'directus_users.last_name',
            'companies.is_new',
            'v_plans.value AS plan',
    ]);

    return Object.assign(data, {
        type,
        role: Object.keys(ROLES).find(key => ROLES[key] === data.role)
    });

}))



// -----------------
// Subscription
// -----------------

router.get('/subscription', mw.role('company'), controller(async ({ company, db }) => {

    const subscriptions =  await db('subscriptions')
        .innerJoin('plans_prices', 'plans_prices.id', 'subscriptions.price')
        .where('subscriptions.company', company)
        .select([
            'subscriptions.price',
            'subscriptions.status',
            'subscriptions.expires_at',
            'subscriptions.canceled',
            'plans_prices.plan',
            'plans_prices.amount',
            'plans_prices.active',
            'plans_prices.annual',
            db.raw(`POSITION('manual_' IN subscriptions.id) = 1 AS manual`)
        ])

    subscriptions.forEach(sub => sub.manual && delete sub.amount);

    if (subscriptions.length === 0) return false;
    if (subscriptions.length === 1) return subscriptions[0];

    const active = subscriptions.filter(sub => sub.status !== 'canceled');
    if (active.length === 0) return subscriptions.sort((a, b) => b.expires_at - a.expires_at)[0];
    if (active.length === 1) return active[0];

    let subscription;
    const cancels = active.every(subscription => subscription.canceled);
    if (cancels) subscription = active.sort((a, b) => b.expires_at - a.expires_at)[0];
    else subscription = active.filter(sub => !sub.canceled).sort((a, b) => a.expires_at - b.expires_at)[0];
    subscription.amount = null;
    return subscription;

}))



// -----------------
// Me
// -----------------

router.post('/password', controller(async ({ body, user, db }) => {

    const input = joi.check(body, {
        old_password: joi.string().min(6).required(), // min 6 for old users
        new_password: joi.string().password().required(),
        re_password: joi.string().re_password(joi.ref('new_password')).required(),
    })

    const data = await db('directus_users').pk(user).select('password');
    const verified = data && await bcrypt.compare(input.old_password, data.password);

    if (!data || !verified) {
        throw new Exception('INVALID_PASSWORD');
    }

    await db('directus_users').pk(user).$update({
        password: await bcrypt.hash(input.new_password, 13)
    })

}))



// -----------------
// Views
// -----------------

router.get('/views', controller(async ({ query, role, user, db }) => {

    const { days } = joi.check(query, {
        days: joi.number().natural().max(14).required()
    })

    const date = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);

    if (role === ROLES.candidate) return db('users_views')
        .where('created_at', '>=', date)
        .where('user', user)
        .groupByRaw(`DATE_TRUNC('hour', created_at)`)
        .selectRaw(`DATE_TRUNC('hour', created_at) AS date`)
        .count('id AS count')

    if (role === ROLES.company || role === ROLES.member) return db('jobs_views')
        .innerJoin('jobs', 'jobs.id', 'jobs_views.job')
        .query('jobs', 'filter')
        .where('jobs_views.created_at', '>=', date)
        .groupByRaw(`DATE_TRUNC('hour', jobs_views.created_at)`)
        .selectRaw(`DATE_TRUNC('hour', jobs_views.created_at) AS date`)
        .count('jobs_views.id AS count')

}))



// -----------------
// Delete file
// -----------------

router.delete('/files/:id', controller(async ({ params, files, db }) => {

    const { id } = joi.check(params, schemas.uuid);

    const exists = await db('directus_files').query('directus_files', 'filter').pk(id).$exists();
    if (!exists) return; // not found

    return files.remove(id)

}))



// -----------------
// Set language
// -----------------

router.post('/locale', controller(async ({ locale, user, role, company, db }) => {

    if (role === ROLES.company) await db('companies').pk(company).$update({ locale });
    await db('directus_users').pk(user).$update({ locale });

}))





// -----------------
// Exports
// -----------------

export default router;