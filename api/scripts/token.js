import { jwt, knex } from '#api/index.js'

const email = process.argv.pop();
const data = await knex('directus_users').fields('directus_users', 'auth').where('directus_users.email', email).first();


data.type = data.company ? 'company' : 'candidate';
data.user = data.id;
delete data.id;

console.log(jwt.sign(data, '1y'));
knex.destroy()