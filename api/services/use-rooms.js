import { ROLES, TEMPLATES_CANDIDATE, TEMPLATES_COMPANY, TEMPLATES_STATUSES } from '@vacature/shared/constants.js'
import { Exception, joi, io, rules } from '#api/index.js'

export default function ({ user, company, role, type, db, mails }) {



    // ----------------------
    // Schema
    // ----------------------

    const getSchema = () => ({

        role: rules.uuid.valid(...Object.values(ROLES)),

        room: joi.object({
            candidate:  rules.uuid.when('...role', {
                is: ROLES.candidate,
                then: joi.valid(user)
            }),
            company: rules.id.when('...role', {
                is: [ROLES.company, ROLES.member],
                then: joi.valid(company)
            }),
            job: joi.number().natural().allow(null).default(null)
        }).required(),

        template: joi.string()
            .when('role', {
                is: ROLES.candidate,
                then: joi.valid(...TEMPLATES_CANDIDATE),
                otherwise: joi.valid(...TEMPLATES_COMPANY)
            })
            .when('room', {
                is: joi.array().max(2),
                then: joi.forbidden()
            }),

        message: joi.string().msg().when('template', {
            is: joi.exist().valid(...TEMPLATES_COMPANY),
            then: joi.optional(),
            otherwise: joi.required()
        }),

        attachment: joi.string().guid().when('template', {
            is: joi.exist().valid('APPLICATION_CREATED'),
            then: joi.optional().allow(null),
            otherwise: joi.forbidden()
        })

    })



    // ----------------------
    // Options DB checks
    // ----------------------

    async function check (config) {

        const options = joi.check({ ...config, role }, getSchema());
        const checks = [];

        if (options.room.candidate) {
            checks.push(db('v_candidates').pk(options.room.candidate).exists());
        }

        if (options.room.job) {
            const query = db('v_jobs AS jobs').where('jobs.company', options.room.company).pk(options.room.job);
            if (role === ROLES.member) query.query('jobs', 'filter');
            checks.push(query.exists());
        }

        if (options.attachment) {
            checks.push(db('directus_files').query('directus_files', 'filter', { folder: 'cvs' }).pk(options.attachment).exists());
        }

        if (options.template) {
            const status = TEMPLATES_STATUSES[options.template];
            const query = db('applications').relation('applications', 'rooms').where(options.room);
            if (status !== 'PENDING') query.where({ status });
            checks.push(query.exists(false));
        }

        const results = await db.unionAll(checks);
        const invalid = results.some(result => !result.value);
        if (invalid) throw new Exception('INVALID_MESSAGE', results);

        return options;

    }



    // -----------------
    // Get room
    // -----------------

    async function getRoom (options) {

        const defaults = { [`${type}_visited_at`]: new Date() }
        let [exists] = await db('rooms').where(options.room).$update(defaults);
        if (!exists) exists = await db('rooms').$insert({ ...options.room, ...defaults });

        return db('rooms')
            .pk(exists.id)
            .fields('rooms', 'item')
            .select(`${type}_visited_at AS visited_at`)
    }



    // -----------------
    // Get message
    // -----------------

    async function getMessage (options, room) {

        const { id } = await db('messages').$insert({
            room: room.id,
            template: options.template,
            message: options.message,
            attachment: options.attachment,
            created_at: room.visited_at
        });

        return db('messages')
            .fields('messages', 'item')
            .select('messages.room')
            .selectRaw('? AS type', type)
            .pk(id)

    }



    // -----------------
    // Set application
    // -----------------

    async function mail ({ template, message, attachment: cv }, room, receiver) {

        const status = TEMPLATES_STATUSES[template];
        const toCandidate = TEMPLATES_COMPANY.includes(template) || receiver === 'candidate';

        if (status === 'PENDING') await db('applications').$insert({ room: room.id, status, cv });
        else if (status) await db('applications').where({ room: room.id }).$update({ status });

        function getLocale (table, pk) {
            return db(table).pk(pk).select('locale').then(item => item.locale);
        }

        function getMembers () {
            return db('v_rooms_members').where('room', room.id).innerJoin('directus_users', 'directus_users.id', 'v_rooms_members.member').pluck('directus_users.email')
        }

        const { to, cc, locale } = toCandidate ? {
            to: room.candidate.email,
            locale: await getLocale('directus_users', room.candidate.id)
        } : {
            to: room.company.email,
            locale: await getLocale('companies', room.company.id),
            cc: await getMembers()
        }

        const data = { ...room, room: room.id, message }
        await mails.send(template, { to, cc, locale, data });

    }



    // -----------------
    // Read
    // -----------------

    async function read (room, type) {

        const users = type === 'candidate' ? [room.candidate] : await db('v_rooms_members').where('room', room.id).pluck('member');
        const active = io.isActive(`rooms.${room.id}.${type}`);
        const online = io.inApp(users);

        if (active) await db('rooms').pk(room.id).$update({
            [`${type}_visited_at`]: new Date()
        })

        for (const id of online) {
            io.to(id).emit('update');
        }

    }



    // -----------------
    // Message
    // -----------------

    async function message (config) {

        const options = await check(config);
        const room = await getRoom(options);
        const message = await getMessage(options, room);
        const opposite = type === 'candidate' ? 'company' : 'candidate';

        if (options.template) {
            await mail(options, room);
        }

        io.to(`rooms.${room.id}`).emit('message', message);
        await read({ ...options.room, id: room.id }, opposite);

    }



    // -----------------
    // Exports
    // -----------------

    return {
        message,
        read,
        mail
    }



}