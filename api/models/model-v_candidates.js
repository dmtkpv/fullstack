// -----------------
// Relations
// -----------------

const relations = {

    favorite_users () {
        const { company } = this.userParams;
        return this.leftJoin('favorite_users', ctx => {
            ctx.on('favorite_users.user', 'v_candidates.id');
            ctx.on('favorite_users.company', this.client.raw('?', company));
        })
    },

    v_cvs () {
        const { company } = this.userParams;
        return this.leftJoin('v_cvs', ctx => {
            ctx.on('v_cvs.candidate', 'v_candidates.id');
            ctx.on('v_cvs.company', this.client.raw('?', company));
        })
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    item () {
        this.relation('v_candidates', 'favorite_users')
        return [
            'v_candidates.id',
            'v_candidates.first_name',
            'v_candidates.last_name',
            'v_candidates.avatar',
            'v_candidates.email',
            'v_candidates.education_field',
            'v_candidates.education_level',
            'favorite_users.id AS bookmark',
        ]
    }

}



// -----------------
// Filter
// -----------------

function filter ({ search, education_level, education_field, gender }) {

    if (search) {
        this.where(ctx => {
            ctx.where('v_candidates.first_name', 'ILIKE', `%${search}%`);
            ctx.orWhere('v_candidates.last_name', 'ILIKE', `%${search}%`);
            ctx.orWhere('v_candidates.tags', 'ILIKE', `%${search}%`);
        })
    }

    if (education_field) {
        this.where('v_candidates.education_field', education_field);
    }

    if (education_level) {
        this.where('v_candidates.education_level', education_level);
    }

    if (gender) {
        this.where('v_candidates.gender', gender);
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