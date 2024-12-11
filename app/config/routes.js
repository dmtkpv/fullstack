import Home from '#app/routes/home.vue'
import Premium from '#app/routes/premium.vue'
import Terms from '#app/routes/terms.vue'
import Privacy from '#app/routes/privacy.vue'
import Unsubscribe from '#app/routes/unsubscribe.vue'

import Company from '#app/routes/company/company.vue'

import Auth from '#app/routes/auth.vue'
import AuthLogin from '#app/routes/auth/auth-login.vue'
import AuthRegister from '#app/routes/auth/auth-register.vue'
import AuthVerify from '#app/routes/auth/auth-verify.vue'
import AuthReset from '#app/routes/auth/auth-reset.vue'
import AuthRecovery from '#app/routes/auth/auth-recovery.vue'

import Jobs from '#app/routes/jobs/jobs.vue'
import Job from '#app/routes/jobs/job.vue'
import JobApply from '#app/routes/jobs/job-apply.vue'

import Candidates from '#app/routes/candidates/candidates.vue'
import Candidate from '#app/routes/candidates/candidate.vue'

import Account from '#app/routes/account.vue'
import AccountDashboard from '#app/routes/account/account-dashboard.vue'
import AccountProfile from '#app/routes/account/account-profile.vue'
import AccountNotifications from '#app/routes/account/account-notifications.vue'
import AccountRooms from '#app/routes/account/account-rooms.vue'
import AccountRoom from '#app/routes/account/account-room.vue'

import AccountApplicants from '#app/routes/account/account-applicants.vue'
import AccountFavoriteCandidates from '#app/routes/account/account-favorite-candidates.vue'
import AccountJobs from '#app/routes/account/account-jobs.vue'
import AccountJob from '#app/routes/account/account-job.vue'

import AccountLocation from '#app/routes/account/account-location.vue'
import AccountLocations from '#app/routes/account/account-locations.vue'
import AccountMember from '#app/routes/account/account-member.vue'
import AccountMembers from '#app/routes/account/account-members.vue'
import AccountPlans from '#app/routes/account/account-plans.vue'
import AccountCompany from '#app/routes/account/account-company.vue'

import AccountApplications from '#app/routes/account/account-applications.vue'
import AccountCV from '#app/routes/account/account-cv.vue'
import AccountFavoriteJobs from '#app/routes/account/account-favorite-jobs.vue'

export default [



    // ----------------
    // Landings
    // ----------------

    {
        name: 'home',
        component: Home
    },
    {
        name: 'premium',
        component: Premium
    },
    {
        name: 'terms',
        component: Terms
    },
    {
        name: 'privacy',
        component: Privacy
    },
    {
        name: 'unsubscribe',
        component: Unsubscribe
    },



    // ----------------
    // Jobs
    // ----------------

    {
        name: 'jobs',
        component: Jobs
    },
    {
        name: 'job',
        component: Job,
        meta: {
            back: 'jobs'
        }
    },
    {
        name: 'job-apply',
        component: JobApply,
        meta: {
            back: ({ params }) => ({ name: 'job', params }),
            roles: ['candidate']
        }
    },



    // ----------------
    // Candidates
    // ----------------

    {
        name: 'candidates',
        component: Candidates,
        meta: {
            plan: 3,
            roles: ['company', 'member']
        }
    },
    {
        name: 'candidate',
        component: Candidate,
        meta: {
            back: 'candidates',
            roles: ['company', 'member']
        }
    },



    // ----------------
    // Companies
    // ----------------

    {
        name: 'company',
        component: Company,
        meta: {
            back: (to, from) => from
        }
    },



    // ----------------
    // Auth
    // ----------------

    {
        name: 'auth',
        component: Auth,
        children: [
            {
                name: 'auth-login',
                component: AuthLogin
            },
            {
                name: 'auth-register',
                component: AuthRegister
            },
            {
                name: 'auth-verify',
                component: AuthVerify
            },
            {
                name: 'auth-reset',
                component: AuthReset
            },
            {
                name: 'auth-recovery',
                component: AuthRecovery
            }
        ]
    },



    // ----------------
    // Account
    // ----------------

    {
        name: 'account',
        component: Account,
        children: [

            // common

            {
                name: 'account-dashboard',
                component: AccountDashboard,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-profile',
                component: AccountProfile,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-notifications',
                component: AccountNotifications,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-rooms',
                component: AccountRooms,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-room',
                component: AccountRoom,
                meta: {
                    back: (to, from) => from || { name: 'account-rooms' },
                    roles: ['candidate', 'company', 'member']
                }
            },


            // company & member

            {
                name: 'account-applicants',
                component: AccountApplicants,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-favorite-candidates',
                component: AccountFavoriteCandidates,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-jobs',
                component: AccountJobs,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-job',
                component: AccountJob,
                meta: {
                    back: 'account-jobs',
                    roles: ['company', 'member']
                }
            },

            // company

            {
                name: 'account-locations',
                component: AccountLocations,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-location',
                component: AccountLocation,
                meta: {
                    back: 'account-locations',
                    roles: ['company']
                }
            },
            {
                name: 'account-members',
                component: AccountMembers,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-member',
                component: AccountMember,
                meta: {
                    back: 'account-members',
                    roles: ['company']
                }
            },
            {
                name: 'account-company',
                component: AccountCompany,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-plans',
                component: AccountPlans,
                meta: {
                    roles: ['company']
                }
            },

            // candidate

            {
                name: 'account-applications',
                component: AccountApplications,
                meta: {
                    roles: ['candidate']
                }
            },
            {
                name: 'account-cv',
                component: AccountCV,
                meta: {
                    roles: ['candidate']
                }
            },
            {
                name: 'account-favorite-jobs',
                component: AccountFavoriteJobs,
                meta: {
                    roles: ['candidate']
                }
            }

        ]
    }



]