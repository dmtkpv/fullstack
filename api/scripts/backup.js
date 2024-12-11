import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'

const {
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD
} = process.env

const DIR = '../backups';

if (!existsSync(DIR)){
    mkdirSync(DIR);
}

const backups = readdirSync(DIR).sort();
if (backups.length > 30) unlinkSync(`${DIR}/${backups[0]}`);

execSync(`PGPASSWORD="${DB_PASSWORD}" pg_dump -U ${DB_USER} -h ${DB_HOST} -d ${DB_DATABASE} -f ${DIR}/${new Date().toISOString()}.sql -F c`);