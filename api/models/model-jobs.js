// -----------------
// Data
// -----------------

const data = {
    images: {
        table: 'jobs_images',
        fk: 'image',
        pk: 'job'
    },
    categories: {
        table: 'jobs_categories',
        fk: 'category',
        pk: 'job'
    },
    education_levels: {
        table: 'jobs_education_levels',
        fk: 'education_level',
        pk: 'job'
    },
    education_fields: {
        table: 'jobs_education_fields',
        fk: 'education_field',
        pk: 'job'
    },
    education_paths: {
        table: 'jobs_education_paths',
        fk: 'education_path',
        pk: 'job'
    }
}



// -----------------
// Relations
// -----------------

const relations = {

    users_locations (method = 'inner') {
        const { user } = this.userParams;
        return this[method + 'Join']('users_locations', ctx => {
            ctx.on('users_locations.location', 'jobs.location');
            ctx.on('users_locations.user', this.client.raw('?', user));
        })
    },

    directus_users () {
        return this.innerJoin('users_locations AS ul', 'ul.location', 'jobs.location').innerJoin('directus_users', 'directus_users.id', 'ul.user')
    },

    locations (method = 'inner') {
        return this[method + 'Join']('locations', 'locations.id', 'jobs.location')
    },

    jobs_categories () {
        return this.leftJoin('jobs_categories', 'jobs_categories.job', 'jobs.id')
    },

    jobs_education_levels () {
        return this.leftJoin('jobs_education_levels', 'jobs_education_levels.job', 'jobs.id')
    },

    jobs_education_fields () {
        return this.leftJoin('jobs_education_fields', 'jobs_education_fields.job', 'jobs.id')
    },

    jobs_education_paths () {
        return this.leftJoin('jobs_education_paths', 'jobs_education_paths.job', 'jobs.id')
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    form () {
        this.relation('jobs', 'jobs_categories');
        this.relation('jobs', 'jobs_education_levels');
        this.relation('jobs', 'jobs_education_fields');
        this.relation('jobs', 'jobs_education_paths');
        this.groupBy('jobs.id');
        return [
            'jobs.title',
            'jobs.content',
            'jobs.hours',
            'jobs.hours_frequency',
            'jobs.salary_min',
            'jobs.salary_max',
            'jobs.salary_frequency',
            'jobs.type',
            'jobs.urgent',
            'jobs.premium',
            'jobs.experience',
            'jobs.recruitments',
            'jobs.location',
            'jobs.publish',
            'jobs.external',
            'jobs.url',
            this.client.raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_categories.category), NULL) AS categories'),
            this.client.raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_levels.education_level), NULL) AS education_levels'),
            this.client.raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_fields.education_field), NULL) AS education_fields'),
            this.client.raw('ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_paths.education_path), NULL) AS education_paths'),
        ]

    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived = false, search } = {}) {

    if (my) {
        this.relation('jobs', 'users_locations');
    }

    if (archived !== undefined) {
        this.where('jobs.archived', archived)
    }

    if (search) {
        this.where(ctx => {
            ctx.where('jobs.title', 'ILIKE', `%${search}%`);
            ctx.orWhere('jobs.content', 'ILIKE', `%${search}%`)
        })
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