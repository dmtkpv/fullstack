import path from 'path'
import sharp from 'sharp'
import Busboy from 'busboy'
import mime from 'mime-types'
import { v4 as uuid } from 'uuid'
import { Storage } from '@google-cloud/storage'
import { FOLDERS } from '@vacature/shared/constants.js'
import { Exception, joi, rules } from '#api/index.js'

const { GCS_DIR, GCS_BUCKET, GOOGLE_PRIVATE_KEY } = process.env;
const storage = new Storage({ keyFilename: GOOGLE_PRIVATE_KEY });
const bucket = storage.bucket(GCS_BUCKET);

export default function ({ req, db, user }) {



    // -------------------
    // Count
    // -------------------

    async function count ({ max, count }) {
        if (max && await count() >= max) throw new Exception('INVALID_FILES_NUMBER', { max });
    }



    // -------------------
    // Write
    // -------------------

    async function write (file, { filename, mimeType }, options) {

        const { size, extensions, folder } = options;
        const mimeTypes = extensions.map(mime.lookup);
        if (!mimeTypes.includes(mimeType)) throw new Exception('INVALID_FILE_TYPE', { extensions });
        if (!filename) throw new Exception('INVALID_FILE');

        const id = uuid();
        const ext = path.extname(filename).substring(1) || mime.extension(mimeType);
        const title = path.parse(filename).name;
        const filename_disk = `${id}.${ext}`;
        const image = /^image\//.test(mimeType);
        let filesize = 0;

        const payload = {
            id,
            title,
            filename_disk,
            folder,
            uploaded_by: user,
            storage: 'gcs',
            type: mimeType,
            filename_download: filename,
        }

        const optimize = image && sharp()
            .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .on('info', info => {
                payload.height = info.height;
                payload.width = info.width;
            })

        try {

            await count(options); // check before writing a file

            await new Promise((resolve, reject) => {
                const stream = bucket.file(`${GCS_DIR}/${filename_disk}`).createWriteStream();
                stream.on('finish', resolve);
                stream.on('error', reject);
                file.on('error', reject);
                file.on('data', data => filesize += data.length);
                file.on('limit', () => reject(new Exception('INVALID_FILE_SIZE', { max: size })));
                if (image) {
                    optimize.on('error', reject);
                    file.pipe(optimize).pipe(stream);
                }
                else file.pipe(stream);
            })

            payload.filesize = filesize;
            await count(options); // check before writing a row
            await db('directus_files').$insert(payload);
            return payload;

        }

        catch (error) {
            const file = bucket.file(`${GCS_DIR}/${filename_disk}`);
            const [exists] = await file.exists();
            if (exists) await file.delete();
            throw error;
        }

    }



    // -------------------
    // Pipe
    // -------------------

    function upload (config) {

        const options = joi.check(config, {
            folder: joi.string().required().valid(...Object.values(FOLDERS)),
            size: joi.number().natural().required(),
            extensions: joi.array().items(joi.string()).required(),
            max: joi.number().natural(),
            count: joi.function().when('max', {
                is: joi.exist(),
                then: joi.required(),
                otherwise: joi.forbidden()
            })
        });

        return new Promise((resolve, reject) => {

            let files = false;

            const busboy = Busboy({
                headers: req.headers,
                limits: { files: 1, fileSize: options.size * 1024 * 1024 }
            })

            busboy.on('file', (name, file, info) => {
                files = true;
                write(file, info, options).then(resolve).catch(error => {
                    file.resume();
                    reject(error);
                });
            });

            busboy.on('close', () => {
                if (!files) reject(new Exception('INVALID_FILE'));
            });

            busboy.on('error', reject);
            req.pipe(busboy);

        })
    }



    // -------------------
    // Remove
    // -------------------

    async function remove (id) {

        const success = await db('directus_files').where({ id }).$delete();
        if (!success) throw new Exception('NOT_FOUND');

        const [files] = await bucket.getFiles({ prefix: `${GCS_DIR}/${id}` });
        await Promise.all(files.map(file => file.delete()));

        return true;

    }



    // -------------------
    // Exports
    // -------------------

    return {
        upload,
        remove
    }



}