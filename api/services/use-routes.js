import { isString } from 'lodash-es'
import { Exception, joi } from '#api/index.js'

export default function ({ db }) {



    // -------------------
    // Data
    // -------------------

    const { APP_URL } = process.env;



    // -------------------
    // Load
    // -------------------

    function load (name) {
        return db('routes')
            .leftJoin('routes as parent', 'parent.name', 'routes.parent')
            .leftJoin('translations as t1', 't1.id', 'routes.path')
            .leftJoin('translations as t2', 't2.id', 'parent.path')
            .where({ 'routes.name': name })
            .first()
            .select([
                db.raw(`JSONB_BUILD_OBJECT('path', t1.en, 'parent', t2.en) AS en`),
                db.raw(`JSONB_BUILD_OBJECT('path', t1.nl, 'parent', t2.nl) AS nl`)
            ])
    }



    // -------------------
    // Translate
    // -------------------

    function translate (record, options) {

        const { query, params, locale } = joi.check(options, {
            locale: joi.string().valid('en', 'nl').required(),
            query: joi.object(),
            params: joi.object()
        });

        const route = record[locale];
        const path = (route.parent ? `${route.parent}/` : '') + route.path;

        let url = path.replace(/:(\w+)/g, (match, param) => {
            if (!params?.[param]) throw new Exception('NO_ROUTE_PARAM');
            return params[param];
        });

        if (query) {
            url += '?'
            url += new URLSearchParams(query).toString()
        }

        if (locale === 'en') {
            url = '/en' + url;
        }

        return APP_URL + url;

    }



    // -------------------
    // Resolve
    // -------------------

    async function resolve (name, options) {
        const record = isString(name) ? await load(name) : name;
        if (!record) throw new Exception('NOT_FOUND');
        return translate(record, options);
    }



    // -------------------
    // Exports
    // -------------------

    return {
        load,
        resolve,
        translate
    }



}