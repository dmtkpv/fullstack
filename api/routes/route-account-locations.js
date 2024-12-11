import express from 'express'
import { Exception, controller, schemas, joi, mw } from '#api/index.js'




// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Get location
// -----------------

const getData = ({ places, db, body }) => async () => {

    const { place_id } = joi.check(body, {
        place_id: joi.string().required()
    })

    const [en, nl] = await Promise.all([
        places.info({ place_id, locale: 'en', fields: ['formatted_address', 'address_components', 'geometry'] }),
        places.info({ place_id, locale: 'nl', fields: ['formatted_address', 'address_components'] })
    ])

    return {
        geometry: db.raw(`ST_GeomFromText('POINT(?? ??)', 4326)`, [en.geometry.lng, en.geometry.lat]),
        address_en: en.formatted_address,
        address_nl: nl.formatted_address,
        components_en: JSON.stringify(en.address_components),
        components_nl: JSON.stringify(nl.address_components),
    }

}



// -----------------
// Middlewares
// -----------------

router.use(mw.use({ getData }));



// -----------------
// List
// -----------------

router.get('/', mw.role('company', 'member'), controller(async ({ query, locale, db }) => {

    const { limit, page } = joi.check(query, schemas.pager, { required: false });

    return db('locations')
        .query('locations', 'filter')
        .pager(page, limit)
        .newest()
        .select([
            'locations.id',
            `locations.address_${locale} AS address`
        ])

}))



// -----------------
// Count
// -----------------

router.get('/count', mw.role('company', 'member'), controller(async ({ db }) => {

    return db('locations')
        .query('locations', 'filter')
        .$count();

}))



// -----------------
// Item
// -----------------

router.get('/:id', mw.role('company', 'member'), controller(async ({ params, locale, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('locations')
        .query('locations', 'filter')
        .pk(id)
        .select([
            'locations.id',
            `locations.address_${locale} AS address`
        ])
        .selectJSON('geometry', [
            'ST_Y(geometry) AS lat',
            'ST_X(geometry) AS lng',
        ])

}))



// -----------------
// Create
// -----------------

router.post('/', mw.role('company'), controller(async ({ getData, user, company, locale, db }) => {

    const plan = await db('v_plans').where({ company }).first();

    if (!plan?.value) {
        const count = await db('locations').query('locations', 'filter').$count();
        if (count) throw new Exception('UNPAID');
    }

    const location = await getData();
    location.users = [user];
    location.company = company;

    return db('locations').$insert(location, [`address_${locale}`])

}))



// -----------------
// Update
// -----------------

router.patch('/:id', mw.role('company'), controller(async ({ getData, params, db }) => {

    const { id } = joi.check(params, schemas.id);

    const exists = await db('locations').query('locations', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    const location = await getData();

    return db('locations')
        .pk(id)
        .$update(location)

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', mw.role('company'), controller(async ({ params, apps, db }) => {

    const { id } = joi.check(params, schemas.id);
    const exists = await db('locations').query('locations', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    return db('locations')
        .pk(id)
        .$update({ archived: true });

}))



// -----------------
// Exports
// -----------------

export default router;