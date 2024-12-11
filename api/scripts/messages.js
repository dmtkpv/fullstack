import { knex, use } from '#api/index.js'



// ----------------------
// Notify
// ----------------------

async function notify ({ type, db, rooms }) {

    const recent = await db('messages')
        .relation('messages', 'rooms')
        .whereNull('messages.template')
        .whereRaw(`messages.created_at > rooms.${type}_visited_at`)
        .whereRaw(`(messages.created_at - rooms.${type}_mailed_at) > INTERVAL '10 minutes'`)
        .groupBy('rooms.id')
        .select('rooms.id')
        .selectRaw('LEFT(STRING_AGG(messages.message, \'<br><br>\'), 3000) AS message');

    for (const { id, message } of recent) {
        const room = await db('rooms').fields('rooms', 'item').pk(id);
        const template = type === 'candidate' ? 'MESSAGE_TO_CANDIDATE' : 'MESSAGE_TO_COMPANY';
        await rooms.mail({ template, message }, room, type);
        await db('rooms').pk(id).$update({ [`${type}_mailed_at`]: new Date() })
    }

}



// ----------------------
// Exec
// ----------------------

await use({ type: 'company' }, notify);
await use({ type: 'candidate' }, notify);
await knex.destroy();