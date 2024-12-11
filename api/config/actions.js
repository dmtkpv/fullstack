import { ROLES } from '@vacature/shared/constants.js'
import { createQueue } from '@vacature/shared/utils.js'
import { knex, use } from '#api/index.js'

export default {



    // ----------------------
    // Refresh v_jobs
    // ----------------------

    v_jobs: createQueue(async () => {
        const start = Date.now();
        console.log(`REFRESH v_jobs START`)
        await knex.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY v_jobs`);
        console.log(`REFRESH v_jobs END`, Date.now() - start)
    }, 1000),



    // ----------------------
    // Reject application
    // ----------------------

    application_archived: async ({ id }) => {

        const data = await knex('applications')
            .innerJoin('rooms', 'applications.room', 'rooms.id')
            .innerJoin('directus_users', 'directus_users.company', 'rooms.company')
            .pk(id)
            .where('applications.status', 'PENDING')
            .where('directus_users.role', ROLES.company)
            .selectJSON('room', [
                'rooms.candidate',
                'rooms.company',
                'rooms.job',
            ])
            .selectJSON('ctx', [
                'directus_users.id AS user',
                'directus_users.company',
                'directus_users.role',
                `'company' AS type`
            ])

        if (!data) return;
        const { room, ctx } = data;
        const message = { room, template: 'APPLICATION_REJECTED' }
        await use(ctx, ({ rooms }) => rooms.message(message));

    }

}