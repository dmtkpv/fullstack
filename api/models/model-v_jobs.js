// -----------------
// Relations
// -----------------

const relations = {

    favorite_jobs () {
        const { user } = this.userParams;
        return this.leftJoin('favorite_jobs', ctx => {
            ctx.on('favorite_jobs.job', 'v_jobs.id');
            ctx.on('favorite_jobs.user', this.client.raw('?', user));
        })
    },

    rooms () {
        const { user } = this.userParams;
        return this.leftJoin('rooms', ctx => {
            ctx.on('rooms.job', 'v_jobs.id');
            ctx.on('rooms.candidate', this.client.raw('?', user));
        })
    },

    locations () {
        return this.innerJoin('locations', 'locations.id', 'v_jobs.location')
    },

    companies () {
        return this.innerJoin('companies', 'companies.id', 'v_jobs.company')
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    item () {
        const { locale } = this.userParams;
        this.relation('v_jobs', 'favorite_jobs');
        return [
            'v_jobs.id',
            'v_jobs.slug',
            'v_jobs.title',
            'v_jobs.type',
            'v_jobs.urgent',
            'v_jobs.company_name',
            'v_jobs.hours',
            'v_jobs.hours_frequency',
            'v_jobs.salary_min',
            'v_jobs.salary_max',
            'v_jobs.salary_frequency',
            'v_jobs.image',
            `v_jobs.city_${locale} AS city`,
            'favorite_jobs.id AS bookmark',
        ]
    },

    details () {
        const { locale } = this.userParams;
        this.relation('v_jobs', 'locations');
        this.relation('v_jobs', 'companies');
        this.relation('v_jobs', 'rooms');
        this.relation('rooms', 'applications');
        return this.getFields('v_jobs', 'item').concat([
            'v_jobs.premium',
            'v_jobs.content',
            'v_jobs.external',
            'v_jobs.url',
            'v_jobs.experience',
            'v_jobs.recruitments',
            'v_jobs.branches',
            'v_jobs.education_levels',
            'v_jobs.education_fields',
            'v_jobs.education_paths',
            'v_jobs.images',
            'v_jobs.updated_at',
            'rooms.id AS room',
            'applications.id AS application',
            `locations.address_${locale} AS address`,
            `locations.components_${locale} AS location`,
            this.toJSON('geometry', [
                'ST_Y(v_jobs.geometry) AS lat',
                'ST_X(v_jobs.geometry) AS lng',
            ]),
            this.toJSON('company', [
                'companies.id',
                'companies.slug',
                'companies.name',
                'companies.website',
                'companies.phone',
                'companies.facebook'
            ])
        ])
    }


}



// -----------------
// Sort
// -----------------

function sort (sort, location) {

    this.orderBy('v_jobs.premium', 'desc');

    if (!sort || sort <= 2) {
        const direction = sort === 2 ? 'asc' : 'desc';
        this.orderBy('v_jobs.created_at', direction)
    }

    else if (location) {
        const direction = sort === 3 ? 'asc' : 'desc';
        this.orderBy(this.client.raw(`ST_DistanceSphere(v_jobs.geometry, ST_GeomFromText('POINT(?? ??)'))`, [location.lng, location.lat]), direction)
    }

    return this;

}



// -----------------
// Filter
// -----------------

function filter ({ search, branch, education_field, education_level, education_path, date, distance, location, premium }) {

    if (search) {

        this.where(ctx => {
            ctx.where('v_jobs.title', 'ILIKE', `%${search}%`);
            ctx.orWhere('v_jobs.content', 'ILIKE', `%${search}%`)
            ctx.orWhere('v_jobs.company_name', 'ILIKE', `%${search}%`)
            ctx.orWhere('v_jobs.tags', 'ILIKE', `%${search}%`)
        })
    }

    if (branch) {
        this.whereRaw(`? = ANY(v_jobs.branches)`, branch)
    }

    if (education_field) {
        this.whereRaw(`? = ANY(v_jobs.education_fields)`, education_field)
    }

    if (education_level) {
        this.whereRaw(`? = ANY(v_jobs.education_levels)`, education_level)
    }

    if (education_path) {
        this.whereRaw(`? = ANY(v_jobs.education_paths)`, education_path)
    }

    if (distance && location) {
        this.where(this.client.raw(`ST_DistanceSphere(v_jobs.geometry, ST_GeomFromText('POINT(?? ??)'))`, [location.lng, location.lat]), '<=', distance * 1000);
    }

    if (date) {
        this.where('v_jobs.created_at', '>=', date);
    }

    if (premium) {
        this.where('v_jobs.premium', premium);
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    fields,
    queries: { filter, sort }
}