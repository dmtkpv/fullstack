import { ROLES } from '@vacature/shared/constants.js'



// -----------------
// Data
// -----------------

const data = {

    locations: {
        table: 'users_locations',
        fk: 'location',
        pk: 'user'
    },

    languages: {
        table: 'users_languages',
        fk: 'language',
        pk: 'user'
    }

}



// -----------------
// Relations
// -----------------

const relations = {

    users_locations () {
        return this.leftJoin('users_locations', 'users_locations.user', 'directus_users.id')
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    member () {
        return [
            'directus_users.id',
            'directus_users.email',
            'directus_users.avatar',
            'directus_users.first_name',
            'directus_users.last_name',
        ]
    },

    auth () {
        return [
            'directus_users.id',
            'directus_users.role',
            'directus_users.company'
        ]
    }

}



// -----------------
// Filter
// -----------------

function filter ({ members } = {}) {

    if (members) {
        const { company } = this.userParams;
        this.where('directus_users.company', company)
        this.where('directus_users.role', ROLES.member)
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    data,
    relations,
    fields,
    queries: { filter }
}