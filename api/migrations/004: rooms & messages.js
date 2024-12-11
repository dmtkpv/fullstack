import { truncate } from 'lodash-es'
import { TEMPLATES_STATUSES, TEMPLATES_COMPANY } from '@vacature/shared/constants.js'
import createUtils from './utils/001.js'



// ===================
// MIGRATE UP
// ===================

export async function up (knex) {

    const LENGTH = 3000;
    const $ = createUtils(knex);


    // -------------------
    // Schema
    // -------------------

    await knex.schema.createTable('rooms', table => {
        table.increments();
        table.uuid('candidate').notNullable().references('directus_users.id').onDelete('CASCADE');
        table.integer('company').notNullable().references('companies.id').onDelete('CASCADE');
        table.integer('job').references('jobs.id').onDelete('CASCADE');
        table.boolean('company_archived').notNullable().defaultTo(false);
        table.timestamp('company_visited_at').notNullable().defaultTo(knex.raw(`'0001-01-01 00:00:00'`));
        table.timestamp('company_mailed_at').notNullable().defaultTo(knex.raw(`'0001-01-01 00:00:00'`));
        table.boolean('candidate_archived').notNullable().defaultTo(false);
        table.timestamp('candidate_visited_at').notNullable().defaultTo(knex.raw(`'0001-01-01 00:00:00'`));
        table.timestamp('candidate_mailed_at').notNullable().defaultTo(knex.raw(`'0001-01-01 00:00:00'`));
        table.timestamp('messaged_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.unique(['candidate', 'company', 'job']);
        $.setDefaults(table);
    })

    await knex.schema.createTable('messages', table => {
        table.increments();
        table.integer('room').notNullable().references('rooms.id').onDelete('CASCADE');
        table.string('template').references('templates.key').onUpdate('CASCADE');
        table.string('message', LENGTH);
        table.uuid('attachment').references('directus_files.id').onDelete('SET NULL');
        $.setDefaults(table);
    })

    await knex.schema.createTable('applications', table => {
        table.increments();
        table.integer('room').notNullable().references('rooms.id').onDelete('CASCADE').unique();
        table.enu('status', ['PENDING', 'APPROVED', 'REJECTED']).notNullable().defaultTo('PENDING');
        table.boolean('candidate_archived').notNullable().defaultTo(false);
        table.boolean('company_archived').notNullable().defaultTo(false);
        table.uuid('cv').references('directus_files.id').onDelete('SET NULL');
        $.setDefaults(table);
    })

    if (await knex.schema.hasTable('notifications')) {
        await knex.schema.dropTable('notifications');
    }



    // -------------------
    // Routes
    // -------------------

    await $.removeRoute('account-messages');

    await $.createRoute({
        name: 'account-rooms',
        parent: 'account',
        path: ['messages', 'berichten'],
        title: ['Messages', 'Berichten'],
    });

    await $.createRoute({
        name: 'account-room',
        parent: 'account',
        path: ['messages/:id', 'berichten/:id'],
        title: ['Message', 'Bericht'],
    });



    // -------------------
    // Templates
    // -------------------

    const template = {
        route: 'account-room',
        route_options: '{ "params": { "id": "{{room}}" }}',
    }

    await knex('templates')
        .whereIn('key', ['JOB_APPLIED', 'JOB_APPROVED', 'JOB_REJECTED'])
        .update(template)

    await knex('templates').where('key', 'JOB_APPLIED').update('key', 'APPLICATION_CREATED');
    await knex('templates').where('key', 'JOB_APPROVED').update('key', 'APPLICATION_APPROVED');
    await knex('templates').where('key', 'JOB_REJECTED').update('key', 'APPLICATION_REJECTED');



    // -------------------
    // Migrate users_jobs
    // -------------------

    const applications = await knex('users_jobs')
        .innerJoin('jobs', 'jobs.id', 'users_jobs.job')
        .innerJoin('locations', 'locations.id', 'jobs.location')
        .select([
            'users_jobs.user AS candidate',
            'users_jobs.job',
            'users_jobs.approved',
            'users_jobs.message',
            'users_jobs.reply',
            'users_jobs.cv',
            'users_jobs.archived',
            'users_jobs.created_by',
            'users_jobs.updated_by',
            'users_jobs.created_at',
            knex.raw('COALESCE(users_jobs.updated_at, users_jobs.created_at) AS updated_at'),
            'locations.company',
        ]);

    function getTemplate (approved) {
        if (approved === null) return 'APPLICATION_CREATED';
        if (approved === true) return 'APPLICATION_APPROVED';
        if (approved === false) return 'APPLICATION_REJECTED';
    }

    for (const app of applications) {

        const template = getTemplate(app.approved);

        const [room] = await knex('rooms').insert({
            candidate: app.candidate,
            company: app.company,
            job: app.job,
            created_at: app.created_at,
            updated_at: app.updated_at,
            created_by: app.created_by,
            updated_by: app.updated_by,
            messaged_at: app.updated_at,
            company_archived: app.archived,
            company_visited_at: new Date(),
            company_mailed_at: new Date(),
            candidate_visited_at: new Date(),
            candidate_mailed_at: new Date(),
        }, ['id']);

        await knex('applications').insert({
            room: room.id,
            status: TEMPLATES_STATUSES[template],
            company_archived: app.archived,
            cv: app.cv,
            created_at: app.created_at,
            updated_at: app.updated_at,
            created_by: app.created_by,
            updated_by: app.updated_by
        })

        await knex('messages').insert({
            room: room.id,
            template: 'APPLICATION_CREATED',
            message: truncate(app.message, { length: LENGTH }) || null,
            attachment: app.cv,
            created_at: app.created_at,
            created_by: app.created_by,
        })

        if (template !== 'APPLICATION_CREATED') await knex('messages').insert({
            room: room.id,
            template: template,
            message: truncate(app.reply, { length: LENGTH }) || null,
            created_by: app.updated_by,
            created_at: app.updated_at,
        })

    }

    await knex.schema.dropTable('users_jobs');



    // -------------------
    // Texts
    // -------------------


    // applications

    await $.createText('route-account-applicants', 'JOBS_CLEAR', ['All jobs', 'Alle vacatures'])
    await $.createText('route-account-applications', 'STATUS_PLACEHOLDER', ['Select a status', 'Selecteer een status'])
    await $.renameText('route-account-applications', 'STATUS_ANY', 'STATUS_CLEAR')


    // errors

    await $.createText('errors', 'array.max', ['{{label}} must contain less than or equal to {{limit}} items', '{{label}} mag maximaal {{limit}} items bevatten'])
    await $.createText('errors', 'INVALID_MESSAGE', ['Invalid message body', 'Ongeldige berichttekst'])
    await $.removeText('errors', 'MESSAGES_LIMIT');


    // unit-application

    await $.createComponent('unit-application');
    await $.copyText('route-account-applications', 'STATUS_PENDING', 'unit-application');
    await $.copyText('route-account-applications', 'STATUS_APPROVED', 'unit-application');
    await $.copyText('route-account-applications', 'STATUS_REJECTED', 'unit-application');


    // unit-job

    await $.copyText('route-account-applications', 'STATUS_PENDING', 'unit-job');
    await $.copyText('route-account-applications', 'STATUS_APPROVED', 'unit-job');
    await $.copyText('route-account-applications', 'STATUS_REJECTED', 'unit-job');


    // units

    await $.renameComponent('unit-file', 'item-file');
    await $.renameComponent('unit-plan', 'item-plan');
    await $.renameComponent('unit-stats', 'item-stats');
    await $.renameComponent('unit-company-buttons', 'l-company-buttons');


    // m-message

    await $.removeText('m-message', 'ALERT_HEADING');
    await $.removeText('m-message', 'ALERT_MESSAGE');


    // route-account-rooms

    await $.createComponent('route-account-rooms');
    await $.createText('route-account-rooms', 'NIL_TEXT', ['You don\'t have any messages', 'Je hebt geen berichten'])
    await $.createText('route-account-rooms', 'NIL_TEXT_FILTERED', ['No messages found', 'Geen berichten gevonden'])
    await $.copyText('route-account-notifications', 'FILTER_ALL', 'route-account-rooms');
    await $.copyText('route-account-notifications', 'FILTER_READ', 'route-account-rooms');
    await $.copyText('route-account-notifications', 'FILTER_UNREAD', 'route-account-rooms');


}



// ===================
// MIGRATE DOWN
// ===================

export async function down (knex) {

    const $ = createUtils(knex);



    // -------------------
    // Texts
    // -------------------


    // applications

    await $.removeText('route-account-applicants', 'JOBS_CLEAR');
    await $.removeText('route-account-applications', 'STATUS_PLACEHOLDER');
    await $.renameText('route-account-applications', 'STATUS_CLEAR', 'STATUS_ANY')


    // errors

    await $.removeText('errors', 'array.max');
    await $.removeText('errors', 'INVALID_MESSAGE');
    await $.createText('errors', 'MESSAGES_LIMIT', ['You can only send {{max}} message(s) withing {{interval}} hours', 'U kunt slechts {{max}} bericht(en) versturen binnen {{interval}} uur'])


    // unit-application

    await $.removeComponent('unit-application');


    // unit-job

    await $.removeText('unit-job', 'STATUS_PENDING');
    await $.removeText('unit-job', 'STATUS_APPROVED');
    await $.removeText('unit-job', 'STATUS_REJECTED');


    // units

    await $.renameComponent('item-file', 'unit-file');
    await $.renameComponent('item-plan', 'unit-plan');
    await $.renameComponent('item-stats', 'unit-stats');
    await $.renameComponent('l-company-buttons', 'unit-company-buttons');


    // m-message

    await $.createText('m-message', 'ALERT_HEADING', ['The number of messages is limited', 'Het aantal berichten is beperkt']);
    await $.createText('m-message', 'ALERT_MESSAGE', ['You can only send {{max}} message withing {{interval}} hours', 'Je kunt slechts {{max}} berichten sturen binnen {{interval}} uur']);


    // route-account-rooms

    await $.removeComponent('route-account-rooms');



    // -------------------
    // Migrate users_jobs
    // -------------------

    await knex.schema.createTable('users_jobs', table => {
        table.increments();
        table.uuid('user').notNullable().references('directus_users.id').onDelete('CASCADE');
        table.integer('job').notNullable().references('jobs.id').onDelete('CASCADE');
        table.boolean('approved');
        table.text('message').notNullable();
        table.text('reply');
        table.uuid('cv').references('directus_files.id');
        table.boolean('archived').notNullable().defaultTo(false);
        table.unique(['user', 'job']);
        $.setDefaults(table);
    })

    const apps = await knex('applications')
        .innerJoin('rooms', 'rooms.id', 'applications.room')
        .select([
            'rooms.candidate',
            'rooms.job',
            'applications.status',
            'applications.company_archived',
            'rooms.id as room',
        ])

    function getApproved (status) {
        if (status === 'PENDING') return null;
        if (status === 'APPROVED') return true;
        if (status === 'REJECTED') return false;
    }

    for (const app of apps) {

        const first = await knex('messages')
            .where('room', app.room)
            .where('template', 'APPLICATION_CREATED')
            .orderBy('created_at', 'desc')
            .select(['message', 'attachment', 'created_at', 'created_by'])
            .first();

        const last = await knex('messages')
            .where('room', app.room)
            .whereIn('template', TEMPLATES_COMPANY)
            .orderBy('created_at', 'desc')
            .select('message', 'created_at', 'created_by')
            .first();

        await knex('users_jobs').insert({
            user: app.candidate,
            job: app.job,
            approved: getApproved(app.status),
            message: first.message,
            reply: last?.message,
            cv: first.attachment,
            archived: app.company_archived,
            created_at: first.created_at,
            updated_at: last?.created_at,
            created_by: first.created_by,
            updated_by: last?.created_by
        })
    }



    // -------------------
    // Schema
    // -------------------

    await knex.raw('DROP TABLE applications CASCADE');
    await knex.raw('DROP TABLE messages CASCADE');
    await knex.raw('DROP TABLE rooms CASCADE');



    // -------------------
    // Templates
    // -------------------

    const template = {
        route: 'account-application',
        route_options: '{ "params": { "id": "{{application}}" }}',
    }

    await knex('templates')
        .whereIn('key', ['APPLICATION_CREATED', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED'])
        .update(template)

    await knex('templates').where('key', 'APPLICATION_CREATED').update('key', 'JOB_APPLIED');
    await knex('templates').where('key', 'APPLICATION_APPROVED').update('key', 'JOB_APPROVED');
    await knex('templates').where('key', 'APPLICATION_REJECTED').update('key', 'JOB_REJECTED');



    // -------------------
    // Routes
    // -------------------

    await $.removeRoute('account-rooms');
    await $.removeRoute('account-room');



}