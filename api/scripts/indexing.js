import Axios from 'axios'
import { google } from 'googleapis'
import { INDEXING_QUERY } from '@vacature/shared/constants.js'
import { knex } from '#api/index.js'
import useRoutes from '#api/services/use-routes.js'



// -------------------
// Data
// -------------------

const { GOOGLE_PRIVATE_KEY } = process.env;
const TOKEN_TTL = 30 * 60 * 1000;
const routes = useRoutes({ db: knex });
const route = await routes.load('job');

const axios = Axios.create({
    baseURL: 'https://indexing.googleapis.com/v3/urlNotifications:publish'
})

const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_PRIVATE_KEY,
    scopes: 'https://www.googleapis.com/auth/indexing',
});

const token = {
    value: null,
    timestamp: 0
}



// -------------------
// Utils
// -------------------

async function getToken () {
    if (Date.now() - token.timestamp < TOKEN_TTL) return token.value;
    const client = await auth.getClient();
    const data = await client.getAccessToken();
    token.value = data.token;
    token.timestamp = Date.now();
    return token.value;
}

async function publish (job, type) {
    const url = await routes.resolve(route, { params: job, locale: 'nl' });
    const token = await getToken();
    await axios.post('/', { url, type }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    console.log(`${type}: ${url}`)
}

async function add (job) {
    await publish(job, 'URL_UPDATED');
    await knex('jobs_indexed').insert(job).onConflict('id').merge();
}

async function del (job) {
    await publish(job, 'URL_DELETED');
    await knex('jobs_indexed').where('id', job.id).del();
}



// -------------------
// Exec
// -------------------

try {

    const { rows: curr } = await knex.raw(`${INDEXING_QUERY} EXCEPT SELECT * FROM jobs_indexed`);
    const { rows: prev } = await knex.raw(`SELECT * FROM jobs_indexed EXCEPT ${INDEXING_QUERY}`);

    for (const job of prev) {
        const exists = curr.find(item => item.id === job.id);
        if (exists) continue;
        await del(job);
    }

    for (const job of curr) {
        await add(job);
    }

}

catch (e) {
    const message = e.response?.data?.error?.message;
    if (message) console.log(message);
    else console.error(e);
}

await knex.destroy();