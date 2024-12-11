import { createQueue, sleep } from '@vacature/shared/utils.js'
import { reactive, computed, inject, watch, useAttrs, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { FILES } from '@vacature/shared/constants.js'
import forms from '#app/config/forms.js'
import tables from '#app/config/tables.js'



// -------------------
// Helpers
// -------------------

export function exception (code, data) {
    const error = new Error(code);
    error.code = code;
    error.data = data;
    return error;
}

export function empty (object) {
    Object.keys(object).forEach(key => delete object[key]);
}

export function get (object, path) {
    return path?.split('.').reduce((value, key) => value?.[key], object)
}

export function render (string = '', data) {
    return string.replace(/{{ *([\w.]+) *}}/g, (match, path) => get(data, path))
}

export function getProp (name, target) {
    const { SSR } = import.meta.env;
    return !SSR && parseFloat(getComputedStyle(target ?? document.body).getPropertyValue(name))
}

export function download (id) {
    window.open(`${ADMIN_URL}/assets/${id}?download`, '_blank').focus();
}

export function checkSlug ({ name, params, meta }, key) {
    const { id, slug } = meta.preload[key];
    if (!params.slug || params.slug !== slug) return { name, params: { id, slug }};
}

export function isAuthPage (route) {
    route ??= useRoute();
    return computed(() => /auth-/.test(route.name));
}

export function watchPlace (source, callback) {
    const place = useAPI('places-item');
    place.onSuccess(callback);
    watch(source, value => {
        place.cancel();
        if (value) place.quiet(value, { fields: ['geometry'] });
        else callback({});
    })
}

export function getListItem (list, value) {
    return list.find(item => item.value === value);
}

export function getListText (list, value) {
    const item = getListItem.bind(null, list);
    return Array.isArray(value) ? value.map(value => item(value)?.text).join(', ') : item(value)?.text;
}



// -------------------
// Uses
// -------------------

export function useAPI (key) {
    const api = inject('api');
    return key ? api(key) : api;
}

export function useState () {
    return inject('state');
}

export function useSSR () {
    return inject('ssr');
}

export function useCrisp () {
    return inject('crisp');
}

export function useOverlay (key) {
    return inject('overlay')[key];
}

export function useModal () {
    return useOverlay('modal');
}

export function useUser () {
    return inject('state').user;
}

export function usePlan () {
    return inject('plan');
}

export function useContent () {
    return inject('content');
}

export function useIo () {
    return inject('io');
}

export function useTemplate (key) {
    return useContent().template(key)
}

export function useText (component) {
    return useContent().text(component)
}

export function useLists () {
    return useContent().lists();
}

export function useForm (key, ...args) {
    return forms[key](...args);
}

export function useTable (key, ...args) {
    return tables[key](...args);
}

export function usePreload () {
    const route = useRoute();
    const data = reactive(route.meta.preload);
    watch(() => route.meta.preload, value => {
        empty(data);
        Object.assign(data, value)
    })
    return data;
}

export function useAttrEmit () {
    const attrs = useAttrs();
    return (name, payload) => {
        const key = 'on' + name[0].toUpperCase() + name.slice(1);
        attrs[key]?.(payload);
    }
}

export function useAuthClick () {
    const page = isAuthPage();
    const modal = useModal();
    const router = useRouter();
    return name => {
        if (page.value) router.push({ name });
        else modal.show(name)
    }
}

export function useError (cb) {
    const t = useText('errors');
    return error => {
        cb?.(error);
        const translation = t(error.code) || t('DEFAULT');
        return render(translation, error.data || {})
    }
}

export function useFiles (key) {
    const config = FILES[key];
    const format = config.extensions.map(ext => ext.toUpperCase()).join(', ');
    return { ...config, format }
}

export function useReset () {
    const route = useRoute();
    const router = useRouter();
    return () => {
        const { sort } = route.query;
        router.push({ query: { sort } });
    }
}

export function useStatuses ({ t }) {
    return [
        { value: 'PENDING', text: t('STATUS_PENDING'), type: 'yellow' },
        { value: 'APPROVED', text: t('STATUS_APPROVED'), type: 'green' },
        { value: 'REJECTED', text: t('STATUS_REJECTED'), type: 'red' },
    ]
}

export function useIoReload () {
    const io = useIo();
    const route = useRoute();
    const router = useRouter();
    const name = route.name;
    io.on('update', createQueue(async () => {
        await sleep(1000);
        if (route.name !== name) return
        if (route.query.page && route.query.page != 1) return;
        await router.push({ query: { ...route.query, t: Date.now() } })
    }, 4000));
}




// -------------------
// Meta
// -------------------

export function useMeta (data, custom) {

    const route = useRoute();
    const { locale, content } = useState();
    const { title, description } = route.meta;

    return useHead({
        head: {
            htmlAttrs: {
                lang: locale
            }
        },
        meta: [{
            name: 'description',
            content: render(description, data)
        }],
        title: `${content.settings.project_name} - ${render(title, data)}`,
        ...custom
    })

}



// -------------------
// Job
// -------------------

export function useJob (value) {

    const t = useText('unit-job')

    const hours = computed(() => {
        const { hours, hours_frequency } = value;
        return hours && hours_frequency && `${hours} ${t('HOURS')}`
    })

    const salary = computed(() => {
        const frq = value.salary_frequency
        const min = value.salary_min;
        const max = value.salary_max;
        if (!frq || !min && !max) return
        let text;
        if (min && !max) text = `€${min}`
        else if (!min && max) text = `€${max}`
        else if (min === max) text = `€${max}`
        else text = `€${min} - €${max}`;
        return text;
    })

    return {
        hours,
        salary
    }

}



// -------------------
// Totals
// -------------------

export function useFilters (data, config) {

    const lists = useLists();
    const filters = reactive({ suggestions: [] });

    Object.keys(config).forEach(key => {
        filters[key] = structuredClone(toRaw(lists[key]));
    })

    function setList (key) {
        filters[key].forEach(item => item.total = data.count[key]?.[item.value] ?? 0);
    }

    function getSuggestions (key) {
        const param = config[key];
        const counts = data.count[key] ?? {};
        delete counts[data.query?.[param]];
        return Object.keys(counts).map(value => ({ ...getListItem(filters[key], +value), param }));
    }

    watch(() => data.count, () => {
        Object.keys(config).forEach(setList);
        filters.suggestions = Object.keys(config).reduce((suggestions, key) => suggestions.concat(getSuggestions(key)), []).sort((a, b) => b.total - a.total);
    }, { immediate: true })

    return filters

}