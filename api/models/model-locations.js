// -----------------
// Data
// -----------------

const data = {
    users: {
        table: 'users_locations',
        fk: 'user',
        pk: 'location'
    }
}



// -----------------
// Relations
// -----------------

const relations = {

    companies (method = 'inner') {
        return this[method + 'Join']('companies', 'companies.id', 'locations.company')
    },

    users_locations () {
        const { user } = this.userParams;
        return this.innerJoin('users_locations', ctx => {
            ctx.on('users_locations.location', 'locations.id');
            ctx.on('users_locations.user', this.client.raw('?', user));
        })
    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived = false } = {}) {

    if (my) {
        this.relation('locations', 'users_locations');
    }

    if (archived !== undefined) {
        this.where('locations.archived', archived)
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    data,
    relations,
    queries: { filter }
}