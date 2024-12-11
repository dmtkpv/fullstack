import { useStatuses } from '#app/services/utils.js'
import Applicant from '#app/layout/l-table/applicant.vue'
import Application from '#app/layout/l-table/application.vue'
import Date from '#app/layout/l-table/date.vue'
import Job from '#app/layout/l-table/job.vue'
import Tag from '#app/layout/l-table/tag.vue'

export default {



    // -----------------
    // Jobs
    // -----------------

    jobs: ({ t }) => ({

        actions: row => [
            { text: t('ACTION_VIEW'), value: 'view', hidden: !row.publish },
            { text: t('ACTION_EDIT'), value: 'edit', hidden: row.publish === null },
            { text: t('ACTION_DELETE'), value: 'delete' }
        ],

        columns: [
            {
                label: t('TH_JOB'),
                component: Job,
            },
            {
                label: t('TH_DATE'),
                component: Date,
                key: 'created_at',
            },
            {
                label: t('TH_STATUS'),
                component: Tag,
                key: 'publish',
                options: {
                    styles: [
                        { value: null, text: t('STATUS_INACTIVE'), type: 'red' },
                        { value: true, text: t('STATUS_PUBLISHED'), type: 'green' },
                        { value: false, text: t('STATUS_DRAFT'), type: 'yellow' },
                    ]
                }
            }
        ]

    }),



    // -----------------
    // Applicants
    // -----------------

    applicants: ({ t }) => ({

        actions: row => [
            { text: t('ACTION_VIEW'), value: 'view' },
            { text: t('ACTION_DELETE'), value: 'delete' }
        ],

        columns: [
            {
                label: t('TH_APPLICANT'),
                component: Applicant
            },
            {
                label: t('TH_DATE'),
                component: Date,
                key: 'updated_at'
            },
            {
                label: t('TH_STATUS'),
                key: 'status',
                component: Tag,
                options: {
                    styles: useStatuses({ t })
                }
            },
        ]

    }),



    // -----------------
    // Applications
    // -----------------

    applications: ({ t }) => ({

        columns: [
            {
                label: t('TH_JOB'),
                component: Application
            },
            {
                label: t('TH_DATE'),
                key: 'updated_at',
                component: Date
            },
            {
                label: t('TH_STATUS'),
                key: 'status',
                component: Tag,
                options: {
                    styles: useStatuses({ t })
                }
            }
        ]

    }),



}
