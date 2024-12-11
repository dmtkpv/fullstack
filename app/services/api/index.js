import { computed, shallowReactive } from 'vue'
import Axios from 'axios'
import createEndpoint from './endpoint.js'
import createListeners from './listeners.js'

export default function createAPI ({ endpoints, ...options }) {



    // ---------------------
    // Root
    // ---------------------

    function api (key) {
        return createEndpoint(key, api);
    }



    // ---------------------
    // Properties
    // ---------------------

    const listeners = createListeners(true);
    const axios = Axios.create(options);
    const active = shallowReactive([]);
    const pending = computed(() => api.active.length > 0);



    // ---------------------
    // Methods
    // ---------------------

    function cancel (key) {
        const endpoints = api.active.filter(endpoint => (!key || endpoint.key === key) && !endpoint.config?.uncanceled);
        const promises = endpoints.map(endpoint => endpoint.cancel());
        return Promise.all(promises);
    }



    // ---------------------
    // Exports
    // ---------------------

    return Object.assign(api, {
        ...listeners,
        endpoints,
        axios,
        active,
        pending,
        cancel
    });



}