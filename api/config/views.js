import { ROLES } from '@vacature/shared/constants.js'

export default {



    // -------------------
    // Candidates
    // -------------------

    v_candidates: {
        type: '',
        definition: `
            SELECT 
                directus_users.id,
                directus_users.email,
                directus_users.avatar,
                directus_users.first_name,
                directus_users.last_name,
                directus_users.education_field,
                directus_users.education_level,
                directus_users.gender,
                directus_users.cv,
                directus_users.phone,
                directus_users.last_access,
                directus_users.locale,
                ARRAY_REMOVE(ARRAY_AGG(users_languages.language), NULL) AS languages,
                CONCAT_WS(', ', education_fields.value, education_levels.value) AS tags
            FROM directus_users
            LEFT JOIN education_fields ON education_fields.id = directus_users.education_field
            LEFT JOIN education_levels ON education_levels.id = directus_users.education_level
            LEFT JOIN users_languages ON users_languages.user = directus_users.id
            WHERE
                directus_users.role = '${ROLES.candidate}' AND
                directus_users.status = 'active'
            GROUP BY
                directus_users.id,
                education_fields.id,
                education_levels.id
        `
    },



    // -------------------
    // Shared CVs
    // -------------------

    v_cvs: {
        type: '',
        definition: `
            SELECT 
                DISTINCT ON (rooms.company, rooms.candidate)
                rooms.company, 
                rooms.candidate, 
                applications.cv
            FROM applications
            INNER JOIN rooms ON rooms.id = applications.room
            WHERE applications.cv IS NOT NULL
            ORDER BY
                rooms.company, 
                rooms.candidate,
                applications.created_at DESC
        `
    },



    // ----------------------
    // Room company members
    // ----------------------

    v_rooms_members: {
        type: '',
        definition: `
            SELECT 
                rooms.id AS room,
                directus_users.id AS member
            FROM rooms
            INNER JOIN directus_users ON directus_users.company = rooms.company
            WHERE rooms.job IS NULL
            UNION ALL
            SELECT 
                rooms.id AS room,
                users_locations.user AS member
            FROM rooms
            INNER JOIN jobs ON jobs.id = rooms.job
            INNER JOIN users_locations ON users_locations.location = jobs.location
        `
    },



    // -------------------
    // Active plans
    // -------------------

    v_plans: {
        type: '',
        definition: `
            SELECT
                subscriptions.company,
                MAX(plans_prices.plan) AS value
            FROM subscriptions
            INNER JOIN plans_prices ON plans_prices.id = subscriptions.price
            WHERE
                subscriptions.expires_at > NOW() AND
                subscriptions.status IN ('trialing', 'active')
            GROUP BY subscriptions.company
        `
    },



    // -------------------
    // Jobs
    // -------------------

    v_jobs: {
        type: 'materialized',
        definition: `

            SELECT 
                jobs.*,
                companies.id AS company,
                companies.name AS company_name,
                companies.image,
                locations.geometry,
                COALESCE(locations.components_en->>'locality', locations.components_en->>'region', locations.address_en) AS city_en,
                COALESCE(locations.components_nl->>'locality', locations.components_nl->>'region', locations.address_nl) AS city_nl,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT companies_branches.branch), NULL) AS branches,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_categories.category), NULL) AS categories,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_levels.education_level), NULL) AS education_levels,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_fields.education_field), NULL) AS education_fields,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_paths.education_path), NULL) AS education_paths,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_images.image), NULL) AS images,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_keywords.keyword), NULL) AS keywords_jobs,
                ARRAY_TO_STRING(
                    ARRAY_AGG(DISTINCT branches_translations.en) || 
                    ARRAY_AGG(DISTINCT branches_translations.nl) || 
                    ARRAY_AGG(DISTINCT categories_translations.en) || 
                    ARRAY_AGG(DISTINCT categories_translations.nl) || 
                    ARRAY_AGG(DISTINCT education_levels.value) || 
                    ARRAY_AGG(DISTINCT education_fields.value) || 
                    ARRAY_AGG(DISTINCT education_fields.alias) || 
                    ARRAY_AGG(DISTINCT education_paths.value),
                    ', '
                ) AS tags
                
            FROM jobs        
            INNER JOIN locations ON locations.id = jobs.location
            INNER JOIN companies ON companies.id = locations.company
            LEFT JOIN v_plans ON v_plans.company = companies.id
            
            LEFT JOIN companies_branches ON companies_branches.company = companies.id 
            LEFT JOIN jobs_categories ON jobs_categories.job = jobs.id 
            LEFT JOIN jobs_education_levels ON jobs_education_levels.job = jobs.id 
            LEFT JOIN jobs_education_fields ON jobs_education_fields.job = jobs.id 
            LEFT JOIN jobs_education_paths ON jobs_education_paths.job = jobs.id 
            LEFT JOIN jobs_images ON jobs_images.job = jobs.id
            LEFT JOIN jobs_keywords ON jobs_keywords.job = jobs.id
            
            LEFT JOIN branches ON branches.id = companies_branches.branch
            LEFT JOIN categories ON categories.id = jobs_categories.category
            LEFT JOIN education_levels ON education_levels.id = jobs_education_levels.education_level
            LEFT JOIN education_fields ON education_fields.id = jobs_education_fields.education_field
            LEFT JOIN education_paths ON education_paths.id = jobs_education_paths.education_path
            LEFT JOIN keywords_jobs ON keywords_jobs.id = jobs_keywords.keyword
            
            LEFT JOIN translations AS branches_translations ON branches_translations.id = branches.value
            LEFT JOIN translations AS categories_translations ON categories_translations.id = categories.value
            
            WHERE jobs.archived = false AND jobs.publish = true AND (companies.is_new = false OR v_plans.value IS NOT NULL)
            GROUP BY jobs.id, locations.id, companies.id
            
        `,

        onCreate: async db => {
            await db.raw(`CREATE UNIQUE INDEX ON v_jobs (id)`)
            await db.raw(`CREATE INDEX v_jobs_created_at_asc ON v_jobs (premium DESC, created_at ASC)`)
            await db.raw(`CREATE INDEX v_jobs_created_at_desc ON v_jobs (premium DESC, created_at DESC)`)
            await db.raw(`CREATE INDEX v_jobs_geometry ON v_jobs USING gist (geometry)`)
        }

    },



}