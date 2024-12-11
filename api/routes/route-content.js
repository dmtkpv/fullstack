import express from 'express'
import { LISTS, TEMPLATES } from '@vacature/shared/constants.js'
import { controller, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Routes
// -----------------

router.get('/routes', controller(async ({ locale, db }) => {

    return db('routes')
        .leftJoin('translations AS t1', 't1.id', 'routes.path')
        .leftJoin('translations AS t2', 't2.id', 'routes.title')
        .leftJoin('translations AS t3', 't3.id', 'routes.description')
        .select([
            'routes.name',
            `t1.${locale} as path`,
            `t2.${locale} as title`,
            `t3.${locale} as description`
        ]);

}))



// -----------------
// Templates
// -----------------

router.get('/templates', controller(async ({ locale, db }) => {

    return db('templates')
        .leftJoin('translations', 'translations.id', 'templates.body')
        .whereIn('templates.key', TEMPLATES)
        .select([
            'templates.key',
            'templates.route',
            'templates.route_options',
            `translations.${locale} as body`
        ]);

}))



// -----------------
// Lists
// -----------------

router.get('/lists/:list', controller(async ({ params, locale, db }) => {

    const { list } = joi.check(params, {
        list: joi.string().valid(...Object.keys(LISTS)).required()
    });

    const { sort, data, alias, translation } = LISTS[list];
    const query = db(list).select(`${list}.id AS value`);
    if (data) query.select(`${list}.data`);
    if (alias) query.select(`${list}.alias`);
    if (translation) query.innerJoin('translations', 'translations.id', `${list}.value`).select(`translations.${locale} AS text`);
    else query.select('value AS text');
    if (sort) query.orderBy('sort');
    else query.orderBy('text');

    return query;

}))



// -----------------
// Texts
// -----------------

router.get('/texts', controller(async ({ query, locale, db }) => {

    const { components } = joi.check(query, {
        components: joi.array().items(joi.string()).required()
    });

    return db('texts_translations AS texts')
        .leftJoin('translations', 'translations.id', 'texts.translation')
        .whereIn('texts.component', components)
        .select([
            'texts.key',
            'texts.component',
            `translations.${locale} AS translation`
        ])

}))



// -----------------
// Plans
// -----------------

router.get('/plans', controller(async ({ locale, db }) => {

    return db('plans')
        .innerJoin('plans_prices AS prices', ctx => {
            ctx.on('prices.plan', 'plans.id');
            ctx.on('prices.active', db.raw('?', true));
        })
        .innerJoin('plans_features AS features', 'features.plan', 'plans.id')
        .innerJoin('translations AS t1', 't1.id', 'plans.title')
        .innerJoin('translations AS t2', 't2.id', 'plans.description')
        .innerJoin('translations AS t3', 't3.id', 'features.title')
        .orderBy('plans.sort', 'features.sort')
        .groupBy('plans.id', 't1.id', 't2.id')
        .select([
            'plans.id',
            `t1.${locale} AS title`,
            `t2.${locale} AS description`,
            db.raw(`JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('title', t3.${locale})) as features`),
            db.raw(`JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', prices.id, 'annual', prices.annual, 'amount', prices.amount)) as prices`),
        ])

}))



// -----------------
// Home Locations
// -----------------

router.get('/locations', controller(async ({ locale, db }) => {

    return db('home_locations AS locations')
        .leftJoin('translations', 'translations.id', 'locations.title')
        .orderBy('locations.sort')
        .select([
            'locations.place_id',
            'locations.image',
            `translations.${locale} AS title`
        ])

}))



// -----------------
// FAQ
// -----------------

router.get('/faq', controller(async ({ locale, db }) => {

    return db('faq')
        .innerJoin('translations AS t1', 't1.id', 'faq.question')
        .innerJoin('translations AS t2', 't2.id', 'faq.answer')
        .orderBy('faq.sort')
        .select([
            'faq.id',
            `t1.${locale} AS question`,
            `t2.${locale} AS answer`,
        ])

}))



// -----------------
// Settings
// -----------------

router.get('/settings', controller(async ({ db }) => {
    return db('directus_settings').select('project_name').first();
}))



// -----------------
// URL
// -----------------

router.get('/url', controller(async ({ query, routes }) => {
    const { name, ...options } = query;
    const url = await routes.resolve(name, options);
    return { url }
}))



// -----------------
// Exports
// -----------------

export default router;