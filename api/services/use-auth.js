import { nanoid } from 'nanoid'
import { AUTH } from '@vacature/shared/constants.js'
import { getDomain } from '@vacature/shared/utils.js'
import { jwt, joi, rules, md5 } from '#api/index.js'

const { APP_URL } = process.env;
const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;
const SECURE = /^https:/.test(APP_URL);
const DOMAIN = getDomain(APP_URL);

const COOKIE = {
    httpOnly: true,
    domain: DOMAIN,
    secure: SECURE,
    sameSite: SECURE ? 'none' : undefined,
}

export default function ({ db, res, mails }) {



    // -----------------
    // Set Session
    // -----------------

    async function setSession (data, token) {

        const { id: user, role, company } = joi.check(data, {
            id: rules.uuid,
            role: rules.uuid,
            company: rules.id.allow(null)
        }, { unknown: true })

        const type = company ? 'company' : 'candidate';

        const access = {
            expires: new Date(Date.now() + ACCESS_TTL),
            token: jwt.sign({ user, role, company, type }, ACCESS_TTL / 1000)
        }

        const refresh = {
            expires: new Date(Date.now() + REFRESH_TTL),
            token: nanoid(64)
        }

        if (token) {
            await db('sessions').where({ token }).$update(refresh);
        }

        else {
            await db('sessions').$insert({ user, ...refresh });
        }

        await db('sessions').where('expires', '<', new Date()).$delete();
        await db('directus_users').where({ id: user }).$update({ last_access: new Date() });

        res.cookie(AUTH.cookie, refresh.token, { ...COOKIE, expires: refresh.expires });
        return access;

    }



    // -----------------
    // Delete Session
    // -----------------

    async function delSession (token) {
        await db('directus_sessions').where({ token }).$delete();
        res.clearCookie(AUTH.cookie);
    }



    // -----------------------
    // Get verification token
    // -----------------------

    async function getVerificationToken (data) {

        const { id, email, first_name } = joi.check(data, {
            id: rules.uuid,
            email: joi.string().email().required(),
            first_name: joi.string().required()
        }, { unknown: true })

        const code = Math.floor(Math.random() * 900000) + 100000 + '';
        const token = jwt.sign({ user: id }, '15m');

        await db('directus_users').pk(id).$update({
            verification_code: md5.hash(code)
        })

        await mails.send('VERIFY_EMAIL', {
            to: email,
            data: { headline: code, name: first_name }
        })

        return token;

    }



    // -------------------
    // Exports
    // -------------------

    return {
        setSession,
        delSession,
        getVerificationToken
    }


}