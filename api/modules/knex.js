import { ADMIN } from '@vacature/shared/constants.js'
import pg from 'pg'
import Knex from 'knex'

import config from '#api/config/database.js'
import models from '#api/config/models.js'
import views from '#api/config/views.js'
import triggers from '#api/config/triggers.js'

import extensions from './knex/knex-extensions.js'
import getSchema from './knex/knex-schema.js'
import seedViews from './knex/knex-views.js'
import seedTriggers from './knex/knex-triggers.js'



// -----------------
// Fix count string
// -----------------

pg.types.setTypeParser(20, 'text', parseInt)



// -----------------
// Knex
// -----------------

const knex = Knex(config);

Object.assign(knex.client, {
    userParams: {
        user: ADMIN,
        locale: 'nl'
    }
})

Object.assign(extensions, {
    config: {
        models,
        schema: await getSchema(knex)
    }
})

Object.keys(extensions).forEach(key => {
    Knex.QueryBuilder.extend(key, extensions[key]);
})



// -----------------
// Seed
// -----------------

await seedViews(knex, views);
await seedTriggers(knex, triggers);



// -----------------
// Exports
// -----------------

export default knex;