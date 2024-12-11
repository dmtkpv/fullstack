import express from 'express'
import { pickBy, isEmpty, isEqual } from 'lodash-es'
import { MBO } from '@vacature/shared/constants.js'
import { Exception, controller, joi, schemas, slugify, mw } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schemaQuery = {
    search: joi.string()
}

const schemaBody = {
    id: joi.number().natural(),
    title: joi.string().required(),
    content: joi.string().html().min(30).required(),
    hours: joi.number().natural().allow(null),
    hours_frequency: joi.any().when('hours', {
        is: joi.exist().not(null),
        then: joi.number().natural().required(),
        otherwise: joi.optional().allow(null)
    }),
    salary_min: joi.number().natural().allow(null),
    salary_max: joi.number().natural().allow(null).when('salary_min', {
        is: joi.exist().not(null),
        then: joi.number().greater(joi.ref('salary_min')),
    }),
    salary_frequency: joi.any().when('salary_min', {
        is: joi.exist().not(null),
        then: joi.number().natural().required(),
        otherwise: joi.when('salary_max', {
            is: joi.exist().not(null),
            then: joi.number().natural().required(),
            otherwise: joi.optional().allow(null)
        })
    }),
    categories: joi.array().items(joi.number().natural()),
    education_levels: joi.array().items(joi.number().natural()),
    education_fields: joi.array().items(joi.number().natural()),
    education_paths: joi.array().items(joi.number().natural()),
    location: joi.number().natural().required(),
    experience: joi.number().natural().allow(null),
    recruitments: joi.number().natural().allow(null),
    urgent: joi.boolean(),
    publish: joi.boolean(),
    premium: joi.boolean(),
    external: joi.boolean(),
    url: joi.string().website().when('external', {
        is: true,
        then: joi.required(),
        otherwise: joi.allow(null)
    })
}



// -----------------
// Validate
// -----------------

const validate = ({ db, company }) => async (body) => {

    const input = joi.check(body, schemaBody);

    if (input.education_paths?.length) {
        const valid = input.education_levels?.some(value => MBO.includes(value));
        if (!valid) throw new Exception('object.unknown', { label: 'education_paths' })
    }

    const location = await db('locations')
        .query('locations', 'filter')
        .pk(input.location)
        .$exists()

    if (!location) {
        throw new Exception('INVALID_LOCATION', { label: 'location' })
    }

    const { is_new, plan } = await db('companies')
        .leftJoin('v_plans', 'v_plans.company', 'companies.id')
        .select('companies.is_new', 'v_plans.value AS plan')
        .pk(company)

    if (!plan && (is_new || input.premium || input.urgent)) {
        throw new Exception('UNPAID');
    }

    if (plan === 3) {
        input.premium = true;
    }

    else if (input.premium) {
        const count = await db('jobs')
            .relation('jobs', 'locations')
            .where('locations.company', company)
            .where('jobs.premium', true)
            .where('jobs.archived', false)
            .whereNot('jobs.id', input.id ?? null)
            .$count()
        if (plan === 1 && count >= 1 || plan === 2 && count >= 5) {
            throw new Exception('UNPAID');
        }
    }

    return input;

}



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company', 'member'));
router.use(mw.use({ validate }));



// -----------------
// Create
// -----------------

router.post('/', controller(async ({ db, body, validate }) => {

    const input = await validate(body);

    input.slug = slugify(input.title);
    input.images = await db('directus_files')
        .query('directus_files', 'filter', { job: null })
        .pluck('directus_files.id');

    return db('jobs').$insert(input);

}))



// -----------------
// Update
// -----------------

router.patch('/:id', controller(async ({ params, body, db, validate }) => {

    const { id } = joi.check(params, schemas.id)

    if (isEmpty(body)) {
        throw new Exception('NO_PAYLOAD');
    }

    const job = await db('jobs')
        .query('jobs', 'filter')
        .fields('jobs', 'form')
        .pk(id)

    if (!job) {
        throw new Exception('NOT_FOUND');
    }

    Object.keys(job).forEach(key => {
        if (job[key] === null) delete job[key]; // treat null as undefined
    })

    const input = await validate({ ...job, ...body });
    const data = pickBy(input, (value, key) => !isEqual(job[key], value));
    if (data.title) data.slug = slugify(data.title);

    return isEmpty(data) || db('jobs').pk(id).$update(data);

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', controller(async ({ params, apps, db }) => {

    const { id } = joi.check(params, schemas.id);

    const exists = await db('jobs').query('jobs', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    return db('jobs')
        .pk(id)
        .$update({ archived: true })

}))



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, locale, db }) => {

    const { page, limit, ...filter } = joi.check(query, {
        ...schemaQuery,
        ...schemas.pager,
    }, { required: false })

    return db('jobs')
        .relation('jobs', 'locations')
        .query('jobs', 'filter', filter)
        .pager(page, limit)
        .newest()
        .select([
            'jobs.id',
            'jobs.slug',
            'jobs.title',
            'jobs.publish',
            'jobs.created_at',
            `locations.address_${locale} AS address`,
        ])

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const filter = joi.check(query, schemaQuery, { required: false })

    return db('jobs')
        .query('jobs', 'filter', filter)
        .$count()

}))



// -----------------
// Count Premium
// -----------------

router.get('/premium/count', controller(async ({ company, db }) => {

    return await db('jobs')
        .relation('jobs', 'locations')
        .where('locations.company', company)
        .where('jobs.premium', true)
        .where('jobs.archived', false)
        .$count()

}))



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('jobs')
        .query('jobs', 'filter')
        .fields('jobs', 'form')
        .pk(id)
        .select('jobs.id')

}))



// -----------------
// Exports
// -----------------

export default router;