function upload (file, config) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const data = new FormData();
    data.append('file', file);
    return { ...config, data, headers, method: 'POST' }
}

function upsert (id, config) {
    const method = id ? 'PATCH' : 'POST'
    const url = id ? config.url + `/${id}` : config.url;
    return { ...config, method, url }
}

function toggle (id, config) {
    const method = id ? 'DELETE' : 'POST'
    const url = id ? config.url + `/${id}` : config.url;
    return { ...config, method, url }
}

export default {



    // -----------------
    // Content
    // -----------------

    'content-routes': () => ({
        method: 'GET',
        url: '/content/routes'
    }),

    'content-templates': () => ({
        method: 'GET',
        url: '/content/templates'
    }),

    'content-list': (list) => ({
        method: 'GET',
        url: `/content/lists/${list}`
    }),

    'content-texts': (components) => ({
        method: 'GET',
        url: '/content/texts',
        params: { components }
    }),

    'content-plans': () => ({
        method: 'GET',
        url: '/content/plans'
    }),

    'content-locations': () => ({
        method: 'GET',
        url: '/content/locations'
    }),

    'content-url': (params) => ({
        method: 'GET',
        url: '/content/url',
        params
    }),

    'content-settings': () => ({
        method: 'GET',
        url: '/content/settings'
    }),

    'content-faq': () => ({
        method: 'GET',
        url: '/content/faq'
    }),



    // -----------------
    // Places
    // -----------------

    'places-list': (params) => ({
        method: 'GET',
        url: '/places',
        params
    }),

    'places-item': (id, params) => ({
        method: 'GET',
        url: `/places/${id}`,
        params
    }),



    // -----------------
    // Auth
    // -----------------

    'auth-login': (mode, data) => ({
        method: 'POST',
        url: mode === 'code' ? '/auth/verify' : '/auth/login',
        withCredentials: true,
        unauthorized: true,
        data
    }),

    'auth-register': (data) => ({
        method: 'POST',
        url: '/auth/register',
        data
    }),

    'auth-refresh': () => ({
        method: 'POST',
        url: '/auth/refresh',
        uncanceled: true,
        withCredentials: true,
        unauthorized: true,
    }),

    'auth-logout': () => ({
        method: 'POST',
        url: '/auth/logout',
        withCredentials: true,
        unauthorized: true,
    }),

    'auth-reset': data => ({
        method: 'POST',
        url: '/auth/reset',
        data
    }),

    'auth-recovery': data => ({
        method: 'POST',
        url: '/auth/recovery',
        data
    }),

    'auth-verify-resend': token => ({
        method: 'POST',
        url: '/auth/verify/resend',
        data: { token }
    }),



    // -----------------
    // Jobs
    // -----------------

    'jobs-list': (params) => ({
        method: 'GET',
        url: '/jobs',
        params
    }),

    'jobs-count': (params) => ({
        method: 'GET',
        url: '/jobs/count',
        params
    }),

    'jobs-item': (id) => ({
        method: 'GET',
        url: `/jobs/${id}`
    }),

    'jobs-details': (id) => ({
        method: 'GET',
        url: `/jobs/${id}/details`
    }),



    // -----------------
    // Candidates
    // -----------------

    'candidates-list': (params) => ({
        method: 'GET',
        url: '/candidates',
        params
    }),

    'candidates-count': (params) => ({
        method: 'GET',
        url: '/candidates/count',
        params
    }),

    'candidates-item': (id) => ({
        method: 'GET',
        url: `/candidates/${id}`
    }),



    // -----------------
    // Companies
    // -----------------

    'companies-item': (id) => ({
        method: 'GET',
        url: `/companies/${id}`
    }),

    'companies-item-jobs-list': (id, params) => ({
        method: 'GET',
        url: `/companies/${id}/jobs`,
        params
    }),

    'companies-item-jobs-count': (id) => ({
        method: 'GET',
        url: `/companies/${id}/jobs/count`,
    }),



    // ---------------------
    // Account
    // ---------------------

    'account-me': () => ({
        method: 'GET',
        url: '/account/me'
    }),

    'account-locale': () => ({
        method: 'POST',
        url: '/account/locale'
    }),

    'account-subscription': () => ({
        method: 'GET',
        url: '/account/subscription'
    }),

    'account-views': (params) => ({
        method: 'GET',
        url: '/account/views',
        params
    }),

    'account-files-delete': (id) => ({
        method: 'DELETE',
        url: `/account/files/${id}`
    }),



    // ---------------------
    // Account Messages
    // ---------------------

    'account-messages-list': (params) => ({
        method: 'GET',
        url: `/account/messages`,
        params
    }),

    'account-messages-count': (params) => ({
        method: 'GET',
        url: `/account/messages/count`,
        params
    }),

    'account-messages-create': (data) => ({
        method: 'POST',
        url: '/account/messages',
        data
    }),



    // -----------------
    // Account Profile
    // -----------------

    'account-profile-item': () => ({
        method: 'GET',
        url: '/account/profile'
    }),

    'account-profile-update': data => ({
        method: 'PATCH',
        url: '/account/profile',
        data
    }),

    'account-profile-password': data => ({
        method: 'POST',
        url: '/account/password',
        data
    }),

    'account-profile-image': file => upload(file, {
        url: '/account/profile/image',
    }),



    // -----------------
    // Account CV
    // -----------------

    'account-cvs-list': () => ({
        method: 'GET',
        url: '/account/cvs'
    }),

    'account-cvs-create': file => upload(file, {
        url: '/account/cvs',
    }),

    'account-cvs-delete': id => ({
        method: 'DELETE',
        url: `/account/cvs/${id}`
    }),





    // -----------------
    // Account Company
    // -----------------

    'account-company-item': () => ({
        method: 'GET',
        url: '/account/company'
    }),

    'account-company-update': data => ({
        method: 'PATCH',
        url: '/account/company',
        data
    }),

    'account-company-image': file => upload(file, {
        url: '/account/company/image',
    }),



    // -----------------
    // Account Locations
    // -----------------

    'account-locations-list': params => ({
        method: 'GET',
        url: '/account/locations',
        params
    }),

    'account-locations-count': () => ({
        method: 'GET',
        url: '/account/locations/count'
    }),

    'account-locations-item': id => ({
        method: 'GET',
        url: `/account/locations/${id}`
    }),

    'account-locations-create': (data) => ({
        method: 'POST',
        url: `/account/locations`,
        data
    }),

    'account-locations-upsert': (id, data) => upsert(id, {
        url: '/account/locations',
        data
    }),

    'account-locations-delete': id => ({
        method: 'DELETE',
        url: `/account/locations/${id}`
    }),



    // -----------------
    // Account Jobs
    // -----------------

    'account-jobs-list': params => ({
        method: 'GET',
        url: '/account/jobs',
        params
    }),

    'account-jobs-count': params => ({
        method: 'GET',
        url: '/account/jobs/count',
        params
    }),

    'account-jobs-premium-count': () => ({
        method: 'GET',
        url: '/account/jobs/premium/count'
    }),

    'account-jobs-item': id => ({
        method: 'GET',
        url: `/account/jobs/${id}`
    }),

    'account-jobs-upsert': (id, data) => upsert(id, {
        url: '/account/jobs',
        data
    }),

    'account-jobs-delete': id => ({
        method: 'DELETE',
        url: `/account/jobs/${id}`
    }),

    'account-job-images-list': id => ({
        method: 'GET',
        url: `/account/job-images/${id || ''}`
    }),

    'account-job-images-create': (file, id) => upload(file, {
        url: `/account/job-images/${id || ''}`
    }),



    // -----------------
    // Account Members
    // -----------------

    'account-members-list': params => ({
        method: 'GET',
        url: '/account/members',
        params
    }),

    'account-members-count': () => ({
        method: 'GET',
        url: '/account/members/count'
    }),

    'account-members-item': id => ({
        method: 'GET',
        url: `/account/members/${id}`
    }),

    'account-members-upsert': (id, data) => upsert(id, {
        url: '/account/members',
        data
    }),

    'account-members-delete': id => ({
        method: 'DELETE',
        url: `/account/members/${id}`
    }),



    // -----------------------
    // Account Favorite Jobs
    // -----------------------

    'account-favorite-jobs-list': params => ({
        method: 'GET',
        url: '/account/favorite-jobs',
        params
    }),

    'account-favorite-jobs-count': () => ({
        method: 'GET',
        url: '/account/favorite-jobs/count'
    }),

    'account-favorite-jobs-toggle': (id, data) => toggle(id, {
        url: '/account/favorite-jobs',
        data
    }),



    // -----------------------
    // Account Favorite Users
    // -----------------------

    'account-favorite-users-list': params => ({
        method: 'GET',
        url: '/account/favorite-users',
        params
    }),

    'account-favorite-users-count': () => ({
        method: 'GET',
        url: '/account/favorite-users/count'
    }),

    'account-favorite-users-toggle': (id, data) => toggle(id, {
        url: '/account/favorite-users',
        data
    }),



    // ---------------------
    // Account Applications
    // ---------------------

    'account-applications-list': (params) => ({
        method: 'GET',
        url: `/account/applications`,
        params
    }),

    'account-applications-count': (params) => ({
        method: 'GET',
        url: `/account/applications/count`,
        params
    }),

    'account-applications-jobs': () => ({
        method: 'GET',
        url: `/account/applications/jobs`,
    }),

    'account-applications-delete': (id) => ({
        method: 'DELETE',
        url: `/account/applications/${id}`,
    }),



    // ---------------------
    // Account Rooms
    // ---------------------

    'account-rooms-list': (params) => ({
        method: 'GET',
        url: `/account/rooms`,
        params
    }),

    'account-rooms-count': (params) => ({
        method: 'GET',
        url: `/account/rooms/count`,
        params
    }),

    'account-rooms-item': id => ({
        method: 'GET',
        url: `/account/rooms/${id}`
    }),

    'account-rooms-name': params => ({
        method: 'GET',
        url: `/account/rooms/name`,
        params
    }),



    // -----------------
    // Views
    // -----------------

    'view-job': (id) => ({
        method: 'POST',
        url: '/views/jobs',
        data: { id }
    }),

    'view-user': (id) => ({
        method: 'POST',
        url: '/views/users',
        data: { id }
    }),



    // -----------------
    // Other
    // -----------------

    'stripe': (method, data) => ({
        method: 'POST',
        url: `/stripe/${method}`,
        data
    }),

    'unsubscribe': (data) => ({
        method: 'POST',
        url: `/marketing/unsubscribe`,
        data
    }),



}