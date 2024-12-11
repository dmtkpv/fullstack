import merge from 'lodash.merge'
import createRouter from 'vite-vue-ssr/createRouter'
import config from '#app/config/routes.js'
import { exception, getProp } from '#app/services/utils.js'

export default function ({ ssr, api, state, qs, content, plan, overlay }) {



    // -------------------
    // Data
    // -------------------

    let ssrError = state.error;
    const cache = {};
    const ctx = { api, state, qs, plan, content, cache };
    const routes = [];
    const history = [];



    // -------------------
    // Add routes
    // -------------------

    function createRoute (config) {
        const { path, title, description } = state.content.routes[config.name];
        return merge(config, { path, meta: { title, description }});
    }

    config.forEach(config => {
        const route = createRoute(config);
        if (route.children) route.children = route.children.map(createRoute)
        routes.push(route);
    })



    // -------------------
    // Router
    // -------------------

    const router = createRouter({
        routes,
        base: state.base,
        scrollBehavior: (to, from) => {
            if (to.hash) {
                const top = getProp('--header') + 24;
                return { top, el: to.hash }
            }
            if (to.name !== from.name ||
                to.params.id !== from.params.id ||
                to.query.page !== from.query.page ||
                to.hash !== from.hash
            ) return { top: 0 }
        }
    })



    // -------------------
    // Helpers
    // -------------------

    function resolve (route) {
        const { href } = router.resolve(route);
        return href;
    }

    function redirect (route) {
        if (!ssr) return route;
        state.redirect = resolve(route);
        return false;
    }

    function getProperty (components, prop) {
        return components.map(component => component[prop]).filter(value => !!value);
    }

    async function preload (fn, to, from) {
        const data = await fn(ctx, to, from);
        if (!data) return;
        const values = await Promise.all(Object.values(data));
        return Object.keys(data).reduce((result, key, index) => {
            result[key] = values[index];
            return result
        }, {})
    }

    async function getPreload (to, from) {
        const components = to.matched.map(route => Object.values(route.components)).flat();
        const preloads = getProperty(components, 'preload').map(fn => preload(fn, to, from));
        const texts = getProperty(components, 'texts').flat();
        const lists = getProperty(components, 'lists').flat();
        const data = await Promise.all([...preloads, content.loadTexts(texts), content.loadLists(lists)])
        return data.reduce((payload, value) => Object.assign(payload, value), {});
    }

    function getRedirect (to) {
        const components = to.matched.map(route => Object.values(route.components)).flat();
        return getProperty(components, 'redirect').map(fn => fn(to)).find(val => val);
    }

    function getBack ({ meta: { back }, name, params, query, hash }) {
        const length = history.push({ name, params, query, hash });
        if (length > 100) history.shift();
        if (!back) return;
        if (typeof back === 'function') return back(history.at(-1), history.at(-2));
        const latest = history.findLast(route => route.name === back);
        if (latest) return latest;
        else return { name: back };
    }

    

    // -------------------
    // Before each
    // -------------------

    router.beforeEach(async (to, from) => {

        api.cancel();

        if (ssrError) { // do nothing if there was an error during SSR
            to.meta.error = ssrError;
            ssrError = false;
            return;
        }

        if (!to.matched.length) {
            to.meta.error = exception('NOT_FOUND');
            return;
        }

        if (to.meta.roles && !state.user?.id) {
            return redirect({ name: 'auth-login', query: { from: to.fullPath } });
        }

        if (to.meta.roles && !to.meta.roles.includes(state.user?.role)) {
            to.meta.error = exception('FORBIDDEN');
            return;
        }

        if (to.meta.plan && (to.meta.plan !== state.user?.plan)) {
            to.meta.error = exception('FORBIDDEN');
            return;
        }

        if (!ssr && from.name && to.name === 'account-job' && state.user.is_new && !state.user.plan) {
            overlay.modal.show('premium', { type: 'new-company-jobs' });
            return false;
        }

        if (state.preload) {
            to.meta.preload = state.preload;
            delete state.preload;
            return;
        }

        try {
            to.meta.preload = await getPreload(to, from);
        }

        catch (error) {
            if (error.code === 'ERR_CANCELED') return false;
            if (error.code === 'UNAUTHORIZED') return false; // handles in API hooks
            console.error(error)
            to.meta.error = error;
            return;
        }

        const redirection = getRedirect(to);
        if (redirection) return redirect(redirection);

        if (ssr) {
            state.preload = to.meta.preload;
        }

        state.back = getBack(to);

    })



    // -------------------
    // After each
    // -------------------

    router.afterEach(to => {
        if (to.meta.error) state.error = to.meta.error;
        else delete state.error;
    })



    // -------------------
    // API Hooks
    // -------------------

    api.onError(error => {
        if (error.code !== 'UNAUTHORIZED') return;
        const from = router.currentRoute.value.fullPath;
        const redirect = { name: 'auth-login', query: { from }}
        if (ssr) state.redirect = resolve(redirect);
        else router.push(redirect);
    })



    // -------------------
    // Exports
    // -------------------

    return router;



}