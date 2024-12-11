import { reactive } from 'vue'
import { exception } from '#app/services/utils.js'
import endpoints from '#app/config/api.js'
import createAPI from './api/index.js'

export default function ({ ssr, state }) {



    // -------------------
    // Data
    // -------------------

    const api = createAPI({
        baseURL: `${API_URL}`,
        endpoints
    })




    // -------------------
    // Hooks
    // -------------------

    api.onFetch(({ config }) => {
        config.headers ??= {};
        config.headers['Accept-Language'] = state.locale;
        if (ssr && config.withCredentials) {
            config.headers.Cookie = state.cookies.value;
        }
    })

    api.onSuccess(response => {
        if (ssr && response.headers['set-cookie']) {
            response.headers['set-cookie'].forEach(state.cookies.add);
        }
        return response.data.data ?? null;
    })

    api.onError(e => {
        import.meta.env.DEV && console.error(e);
        const error = e.response?.data?.error || e || {};
        const code = error.code || 'INTERNAL_SERVER_ERROR';
        const data = error.data || {};
        throw exception(code, data);
    })



    // -------------------
    // Exports
    // -------------------

    return api;



}