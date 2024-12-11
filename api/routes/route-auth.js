import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import express from 'express'
import { ROLES, AUTH, ADMIN } from '@vacature/shared/constants.js'
import { Exception, controller, slugify, sleep, joi, jwt, md5 } from '#api/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Login
// -----------------

router.post('/login', controller(async ({ body, auth, db }) => {

    const input = joi.check(body, {
        email: joi.string().email().lowercase().required(),
        password: joi.string().min(6).required(), // 6 min for old users
    });

    const data = await db('directus_users')
        .fields('directus_users', 'auth')
        .where('directus_users.email', input.email)
        .first()
        .select([
            'directus_users.first_name',
            'directus_users.email',
            'directus_users.password',
            'directus_users.status'
        ])

    const verified = data && await bcrypt.compare(input.password, data.password);

    if (!data || !verified) {
        await sleep();
        throw new Exception('INVALID_LOGIN');
    }

    if (data.status === 'invited') {
        await sleep();
        const token = await auth.getVerificationToken(data);
        throw new Exception('UNVERIFIED', { token });
    }

    if (data.status === 'archived') {
        throw new Exception('ARCHIVED_LOGIN');
    }

    if (data.status !== 'active') {
        throw new Exception('INVALID_LOGIN');
    }

    return auth.setSession(data);

}))



// -----------------
// Refresh
// -----------------

router.post('/refresh', controller(async ({ req, auth, db }) => {

    const token = req.cookies[AUTH.cookie];
    if (!token) throw new Exception('UNAUTHORIZED');

    const data = await db('sessions')
        .innerJoin('directus_users', 'directus_users.id', 'sessions.user')
        .fields('directus_users', 'auth')
        .where('directus_users.status', 'active')
        .where('sessions.token', token)
        .where('sessions.expires', '>=', new Date())
        .first()

    if (!data) throw new Exception('UNAUTHORIZED');
    return auth.setSession(data, token);

}))



// -----------------
// Logout
// -----------------

router.post('/logout', controller(async ({ req, auth }) => {

    const token = req.cookies[AUTH.cookie];
    if (!token) throw new Exception('UNAUTHORIZED');
    return auth.delSession(token);

}))



// -----------------
// Verify
// -----------------

router.post('/verify', controller(async ({ body, auth, db }) => {

    const input = joi.check(body, {
        code: joi.string().required(),
        token: joi.string().required()
    });

    const { user } = jwt.verify(input.token);
    const data = await db('directus_users').fields('directus_users', 'auth').select('verification_code').pk(user);

    if (!data) throw new Exception('NOT_FOUND');
    if (!md5.verify(data.verification_code, input.code)) throw new Exception('INVALID_VERIFICATION_CODE');

    await db('directus_users').pk(user).$update({
        status: 'active',
        verification_code: null
    })

    return auth.setSession(data);

}))



// -----------------
// Verify resend
// -----------------

router.post('/verify/resend', controller(async ({ body, auth, db }) => {

    const input = joi.check(body, {
        token: joi.string().required()
    });

    const { user } = jwt.verify(input.token, { ignoreExpiration: true });
    const data = await db('directus_users').select('id', 'email', 'first_name').where('status', 'invited').pk(user);
    if (!data) throw new Exception('NOT_FOUND');

    const token = await auth.getVerificationToken(data);
    return { token }

}))




// -----------------
// Register
// -----------------

router.post('/register', controller(async ({ body, locale, auth, db }) => {

    const input = joi.check(body, {
        role: joi.string().valid('company', 'candidate').required(),
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        email: joi.string().email().lowercase().required(),
        password: joi.string().password().required(),
        re_password: joi.string().re_password(joi.ref('password')).required(),
        company: joi.when('role', {
            is: joi.string().valid('company'),
            then: joi.string().required(),
            otherwise: joi.any().forbidden()
        }),
    });

    const { company, password, re_password, ...user } = input;
    const id = uuid();

    user.role = ROLES[user.role];
    user.password = await bcrypt.hash(password, 13);

    const exists = await db('directus_users').where('email', user.email).select('status').first();

    if (exists) {
        if (exists.status === 'archived') throw new Exception('ARCHIVED_REGISTER');
        else throw new Exception('DUPLICATE_EMAIL');
    }
    else {
        await db('directus_users').$insert({ ...user, id, locale, status: 'invited' })
    }

    if (company) {
        const slug = slugify(company);
        const data = await db('companies').$insert({ name: company, email: user.email, slug, locale })
        await db('directus_users').where({ id }).$update({ company: data.id })
    }

    const token = await auth.getVerificationToken({ id, ...user });
    return { token }

}))



// -----------------
// Reset link
// -----------------

router.post('/reset', controller(async ({ body, mails, db }) => {

    const { email } = joi.check(body, {
        email: joi.string().email().lowercase().required()
    });

    const user = await db('directus_users')
        .where({ email })
        .whereIn('status', ['active', 'invited'])
        .select('id', 'password', 'email', 'first_name')
        .first();

    if (!user) return;

    const hash = md5.hash(user.password);
    const token = jwt.sign({ email, hash }, '1d');

    await mails.send('RESET_PASSWORD', {
        to: user.email,
        data: { token, name: user.first_name }
    })

}))



// -----------------
// Reset Confirm
// -----------------

router.post('/recovery', controller(async ({ body, db }) => {

    const input = joi.check(body, {
        token: joi.string().required(),
        password: joi.string().password().required(),
        re_password: joi.string().re_password(joi.ref('password')).required()
    });

    const { email, hash } = jwt.verify(input.token);

    const user = await db('directus_users')
        .where({ email })
        .whereIn('status', ['active', 'invited'])
        .select('id', 'password')
        .first();

    if (!user) throw new Exception('INVALID_TOKEN');
    if (!md5.verify(hash, user.password)) throw new Exception('INVALID_TOKEN');

    await db('directus_users').where({ email }).$update({
        password: await bcrypt.hash(input.password, 13)
    })

}))



// -----------------
// Exports
// -----------------

export default router;