import path from 'path'
import { writeFileSync } from 'fs'
import { keyBy, chunk } from 'lodash-es'
import { create } from 'xmlbuilder2'
import { knex } from '#api/index.js'



// -----------------
// Load routes
// -----------------

const routes = await knex('routes')
    .innerJoin('translations', 'translations.id', 'routes.path')
    .whereIn('routes.name', [
        'home',
        'premium',
        'terms',
        'privacy',
        'job',
        'company'
    ])
    .select([
        knex.raw(`'/en' || translations.en AS en`),
        'translations.nl',
        'routes.name',
    ])




// -----------------
// Data
// -----------------

const { APP_URL, NODE_ENV } = process.env;
const location = process.argv.pop();
const paths = keyBy(routes, 'name');
const urls = [];



// -----------------
// Helpers
// -----------------

function add (nl, en, date) {
    const url = {
        loc: APP_URL+ nl,
        changefreq: 'daily',
        'xhtml:link': [
            { '@rel': 'alternate', '@hreflang': 'nl', '@href': APP_URL + nl },
            { '@rel': 'alternate', '@hreflang': 'en', '@href': APP_URL + en }
        ]
    }
    if (date) url.lastmod = date.toISOString();
    urls.push(url);
}

function render (path, params) {
    return path.replace(/:(\w+)/g, (match, param) => params[param]);
}

function write (filename, model) {
    writeFileSync(path.join(location, filename), create({ encoding: 'UTF-8' }, model).end({ prettyPrint: NODE_ENV === 'development' }))
}



// -----------------
// Static
// -----------------

add(paths.home.nl, paths.home.en);
add(paths.premium.nl, paths.premium.en);
add(paths.terms.nl, paths.terms.en);
add(paths.privacy.nl, paths.privacy.en);



// -----------------
// Jobs
// -----------------

const jobs = await knex('v_jobs').select(['id', 'slug', 'updated_at AS date']);

for (const job of jobs) {
    add(render(paths.job.nl, job), render(paths.job.en, job), job.date);
}



// -----------------
// Companies
// -----------------

const companies = await knex('companies')
    .relation('companies', 'v_plans')
    .where(builder => {
        builder.where('companies.is_new', false)
        builder.orWhereNotNull('v_plans.value')
    })
    .select([
        'companies.id',
        'companies.slug',
        'companies.updated_at AS date'
    ])

for (const company of companies) {
    add(render(paths.company.nl, company), render(paths.company.en, company), company.date);
}



// -----------------
// Output
// -----------------

const chunks = chunk(urls, 50000);
const date = new Date().toISOString();
const xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

write('sitemap.xml', {
    sitemapindex: {
        '@xmlns': xmlns,
        sitemap: chunks.map((_, i) => ({
            loc: `${APP_URL}/sitemap${i}.xml`,
            lastmod: date
        }))
    }
})

chunks.forEach((chunk, i) => {
    write(`sitemap${i}.xml`, {
        urlset: {
            '@xmlns': xmlns,
            '@xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
            url: chunk
        }
    })
})

knex.destroy();