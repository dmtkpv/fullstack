import express from 'express'
import { ROLES, FILES, FOLDERS } from '@vacature/shared/constants.js'
import { controller, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Get
// -----------------

router.get('/', controller(async ({ user, role, db }) => {

    const query = db('directus_users')
        .pk(user)
        .select([
            'directus_users.id',
            'directus_users.avatar',
            'directus_users.first_name',
            'directus_users.last_name',
            'directus_users.email',
            'directus_users.phone'
        ])

    if (role === ROLES.candidate) {
        query
            .leftJoin('users_languages', 'users_languages.user', 'directus_users.id')
            .groupBy('directus_users.id')
            .select([
                'directus_users.gender',
                'directus_users.education_field',
                'directus_users.education_level',
                'directus_users.cv',
                db.raw('ARRAY_REMOVE(ARRAY_AGG(users_languages.language), NULL) AS languages')
            ])
    }

    return query;

}))



// -----------------
// Patch
// -----------------

router.patch('/', controller(async ({ body, user, role, db }) => {


    // body validations

    const schema = {
        first_name: joi.string(),
        last_name: joi.string(),
        email: joi.string().email().lowercase(),
        phone: joi.string().allow(null),
    }

    if (role === ROLES.candidate) {
        Object.assign(schema, {
            cv: joi.string().guid().allow(null),
            gender: joi.number().natural(),
            education_level: joi.number().natural().allow(null),
            education_field: joi.number().natural().allow(null),
            languages: joi.array().items(joi.number().natural())
        })
    }

    const input = joi.check(body, schema);
    return db('directus_users').pk(user).$update(input);

}))



// -----------------
// Image
// -----------------

router.post('/image', controller(async ({ user, files, db }) => {

    const { size, extensions } = FILES.avatar;
    const { avatar } = await db('directus_users').pk(user).select('avatar');

    const { id } = await files.upload({
        size, extensions,
        folder: FOLDERS.users
    });

    await db('directus_users').pk(user).$update({ avatar: id });

    if (avatar) {
        await files.remove(avatar);
    }

    return { id }

}))



// -----------------
// Exports
// -----------------

export default router;