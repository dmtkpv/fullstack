export default async function ({ state, ssr, api }) {



    // ----------------
    // Data
    // ----------------

    const TEXTS = [
        'l-error',
        'l-header',
        'l-nav',
        'errors',
        'route-auth-login',
        'route-auth-register',
        'route-auth-reset',
        'route-auth-verify',
        'm-premium',
        'm-alert'
    ]



    // ----------------
    // SSR
    // ----------------

    if (ssr) {

        const [routes, templates, texts, settings] = await Promise.all([
            api('content-routes').fetch(),
            api('content-templates').fetch(),
            api('content-texts').fetch(TEXTS),
            api('content-settings').fetch(),
        ])

        state.content = {

            settings,

            routes: routes.reduce((routes, { name, path, title, description }) => {
                routes[name] = { path, title, description };
                return routes;
            }, {}),

            templates: templates.reduce((templates, { key, ...data }) => {
                templates[key] = data
                return templates;
            }, {}),

            texts: texts.reduce((texts, { key, component, translation }) => {
                texts[component] ??= {};
                texts[component][key] = translation;
                return texts;
            }, {}),

            lists: {}

        };

    }



    // ----------------
    // Loaders
    // ----------------

    async function loadTexts (texts) {
        texts = texts.filter(text => !state.content.texts[text]);
        if (!texts.length) return;
        const items = await api('content-texts').fetch(texts)
        for (const { key, component, translation } of items) {
            state.content.texts[component] ??= {};
            state.content.texts[component][key] = translation;
        }
    }

    async function loadLists (lists) {
        lists = lists.filter(list => !state.content.lists[list]);
        if (!lists.length) return;
        const requests = lists.map(async list => {
            state.content.lists[list] = await api('content-list').fetch(list);
        })
        await Promise.all(requests);
    }



    // ----------------
    // Methods
    // ----------------

    function lists () {
        return state.content.lists;
    }

    function template (key) {
        return state.content.templates[key];
    }

    function text (component) {
        return key => state.content.texts[component]?.[key];
    }



    // ----------------
    // Exports
    // ----------------

    return {
        loadTexts,
        loadLists,
        lists,
        template,
        text
    }



}