import express from 'express'
import { FILES, FOLDERS } from '@vacature/shared/constants.js'
import { controller, mw, schemas, joi } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Middlewares
// -----------------

router.use(mw.role('candidate'))



// -----------------
// List
// -----------------

router.get('/', controller(async ({ db }) => {
    return db('directus_files')
        .query('directus_files', 'filter', { folder: 'cvs' })
        .newest('uploaded_on')
        .select(['id', 'filename_download'])
}))



// -----------------
// Upload
// -----------------

router.post('/', controller(async ({ user, files, db }) => {

    const { size, extensions, max } = FILES.cvs;

    const { id, filename_download } = await files.upload({
        size, extensions, max,
        folder: FOLDERS.cvs,
        count: () => db('directus_files').query('directus_files', 'filter', { folder: 'cvs' }).$count()
    });

    await db('directus_users').pk(user).$update({
        cv: id
    });

    return { id, filename_download  }

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', controller(async ({ params, files, db }) => {

    const { id } = joi.check(params, schemas.uuid);

    const item = await db('directus_files')
        .relation('directus_files', 'applications')
        .query('directus_files', 'filter', { folder: 'cvs' })
        .pk(id)
        .select([
            'directus_files.id',
            'applications.id AS application'
        ])

    if (!item) {
        return; // not found
    }

    if (item.application) {
        await db('directus_files').pk(id).$update({ archived: true })
    }

    else {
        await files.remove(id);
    }

    return true;

}))



// -----------------
// Exports
// -----------------

export default router;