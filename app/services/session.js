import { getDomain } from '@vacature/shared/utils.js'
import { empty } from '#app/services/utils.js'

export default async function ({ ssr, state, api, io }) {



    // -------------------
    // Data
    // -------------------

    const domain = getDomain(APP_URL);
    const refresh = api('auth-refresh');
    const logout = api('auth-logout');



    // -------------------
    // Cookies
    // -------------------

    const cookies = {

        add (cookie) {
            ssr ? state.cookies.add(cookie) : document.cookie = cookie;
        },

        get (key) {
            const value = ssr ? state.cookies.value : document.cookie;
            const data = Object.fromEntries(value.split('; ').map(a => a.split('=')))
            return data[key];
        },

        del (key) {
            cookies.add(`${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`);
        },

        set (key, value) {
            cookies.add(`${key}=${value}; Path=/; Domain=${domain}`);
        },

        get token () {
            return cookies.get('token')
        },

        get expires () {
            return cookies.get('expires')
        },

    }



    // -------------------
    // Methods
    // -------------------

    function create ({ token, expires }) {
        cookies.set('token', token);
        cookies.set('expires', new Date(expires).getTime() - 10000);
    }

    function destroy () {
        cookies.del('token');
        cookies.del('expires');
    }



    // -------------------
    // Load user
    // -------------------

    async function load () {

        const data = await Promise.all([
            api('account-me').fetch(),
            api('account-messages-list').fetch({ notification: true, limit: 5 }),
            api('account-messages-count').fetch({ notification: true, read: false }),
            api('account-messages-count').fetch({ read: false }),
            api('account-locale').fetch()
        ])

        Object.assign(state.user, data[0], {
            notifications: data[1],
            unread: {
                notifications: data[2],
                messages: data[3]
            }
        })

    }



    // -------------------
    // Refresh
    // -------------------

    api.onFetch(async ({ config }) => {
        if (!cookies.token) return;
        if (!config.unauthorized && Date.now() > cookies.expires) {
            if (refresh.pending) await refresh.promise;
            else await refresh.fetch();
        }
        if (!config.unauthorized) {
            config.headers['Authorization'] = `Bearer ${cookies.token}`;
        }
    })



    // -------------------
    // API Hooks
    // -------------------

    api.onFetch('auth-logout', () => {
        io.disconnect();
    })

    api.onComplete('auth-logout', () => {
        destroy();
        empty(state.user);
    })

    api.onSuccess('auth-login', async data => {
        create(data);
        await load();
        io.connect(cookies.token);
    })

    api.onError('auth-login', async () => {
        if (cookies.token) await logout.quiet();
    })

    refresh.onSuccess(data => {
        create(data);
    })



    // -------------------
    // Restore user
    // -------------------

    state.user ??= {};

    if (ssr && cookies.token) {
        try { await load() }
        catch (e) { await logout.quiet() }
    }

    if (!ssr && cookies.token) {
        io.connect(cookies.token);
    }



}