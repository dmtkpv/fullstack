// -----------------
// Admin
// -----------------

export const ADMIN = 'b0f02e65-9606-4ad5-ad87-f619b52e286c'



// -----------------
// Roles
// -----------------

export const ROLES = {
    company: 'f0a13552-9365-4761-b9e2-09764d33ed61',
    member: 'd84d7219-d1c8-4b23-8b1b-6358b7b49b14',
    candidate: 'd6dee4b5-dda8-43c9-aca5-72ded53ff247'
}



// -----------------
// Folders
// -----------------

export const FOLDERS = {
    cvs: '00000000-0000-4000-A000-000000000002',
    jobs: '00000000-0000-4000-A000-000000000001',
    users: '00000000-0000-4000-A000-000000000004',
    companies: '00000000-0000-4000-A000-000000000003'
}



// -----------------
// Auth
// -----------------

export const AUTH = {
    cookie: 'api-refresh-token'
}



// -----------------
// Files
// -----------------

export const FILES = {

    cvs: {
        extensions: ['pdf', 'doc', 'docx'],
        size: 10,
        max: 10
    },

    jobs: {
        extensions: ['png', 'jpg', 'jpeg'],
        size: 10,
        max: 4
    },

    avatar: {
        extensions: ['png', 'jpg', 'jpeg'],
        size: 10
    }

}



// -----------------
// Lists
// -----------------

export const LISTS = {
    branches: {
        sort: false,
        translation: true
    },
    categories: { // fields of study
        sort: false,
        translation: true
    },
    education_fields: { // educations
        sort: false,
        alias: true,
        translation: false
    },
    education_levels: {
        data: true,
        sort: true,
        translation: false
    },
    education_paths: {
        sort: true,
        translation: false
    },
    genders: {
        sort: true,
        translation: true
    },
    hours_frequencies: {
        sort: true,
        translation: true
    },
    job_types: {
        data: true,
        sort: true,
        translation: true
    },
    keywords_users: {
        sort: true,
        translation: false
    },
    keywords_jobs: {
        sort: true,
        translation: false
    },
    languages: {
        sort: true,
        translation: true
    },
    salary_frequencies: {
        data: true,
        sort: true,
        translation: true
    }
}



// -----------------
// MBO levels
// -----------------

export const MBO = [
    4,
    5,
    6,
    7
]



// -----------------
// Filters
// -----------------

export const FILTERS_JOBS = {
    education_levels: 'education_level',
    education_paths: 'education_path',
    education_fields: 'education_field',
    branches: 'branch'
}

export const FILTERS_CANDIDATES = {
    genders: 'gender',
    education_fields: 'education_field',
    education_levels: 'education_level'
}



// -----------------
// Templates
// -----------------

export const TEMPLATES_CANDIDATE = [
    'APPLICATION_CREATED'
]

export const TEMPLATES_COMPANY = [
    'APPLICATION_APPROVED',
    'APPLICATION_REJECTED'
]

export const TEMPLATES = [
    ...TEMPLATES_CANDIDATE,
    ...TEMPLATES_COMPANY
]

export const TEMPLATES_STATUSES = {
    'APPLICATION_CREATED': 'PENDING',
    'APPLICATION_APPROVED': 'APPROVED',
    'APPLICATION_REJECTED': 'REJECTED'
}

export const STATUS_TEMPLATES = Object.fromEntries(
    Object.entries(TEMPLATES_STATUSES).map(([key, value]) => [value, key])
)



// -----------------
// Indexing query
// -----------------

export const INDEXING_QUERY = `
    SELECT
        v_jobs.id,
        v_jobs.slug,
        v_jobs.title,
        v_jobs.content,
        v_jobs.image,
        v_jobs.salary_frequency,
        v_jobs.salary_min,
        v_jobs.salary_max,
        v_jobs.experience,
        v_jobs.education_levels,
        companies.name,
        companies.website,
        locations.components_nl::text
    FROM v_jobs
    INNER JOIN locations ON locations.id = v_jobs.location
    INNER JOIN companies ON companies.id = v_jobs.company
    WHERE v_jobs.premium = true
`