import { TEMPLATES_CANDIDATE, TEMPLATES_COMPANY } from '@vacature/shared/constants.js'



// -----------------
// Relations
// -----------------

const relations = {

    rooms () {
        return this.innerJoin('rooms', 'rooms.id', 'messages.room');
    },

    directus_users () {
        return this.leftJoin('directus_users', 'directus_users.id', 'messages.created_by');
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    item () {
        this.relation('messages', 'directus_users');
        return [
            'messages.id',
            'messages.template',
            'messages.message',
            'messages.created_at',
            this.toJSON('created_by', [
                'directus_users.id',
                'directus_users.avatar',
                'directus_users.first_name',
                'directus_users.last_name',
            ])
        ]
    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, read, notification, room } = {}) {

    const { type } = this.client.userParams;

    if (my) {
        this.relation('messages', 'rooms');
        this.query('rooms', 'filter');
    }

    if (read !== undefined) {
        this.relation('messages', 'rooms');
        const sign = read ? '<=' : '>';
        this.whereRaw(`messages.created_at ${sign} rooms.${type}_visited_at`);
    }

    if (notification) {
        const templates = type === 'candidate' ? TEMPLATES_COMPANY : TEMPLATES_CANDIDATE;
        this.whereIn('messages.template', templates);
    }

    if (room) {
        this.where({ room })
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    fields,
    queries: { filter }
}