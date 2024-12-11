import '#app/styles/vars.scss'
import '#app/styles/reset.scss'
import '#app/styles/typography.scss'
import '#app/styles/modules.scss'
import { reactive } from 'vue'
import { createHead } from '@unhead/vue'
import createApp from 'vite-vue-ssr/createApp'
import { ui, units, layout, modals, inputs, landings } from '#app/config/components.js'
import createCrisp from '#app/services/crisp.js'
import createOverlay from '#app/services/overlay.js'
import createAPI from '#app/services/api.js'
import createContent from '#app/services/content.js'
import createRouter from '#app/services/router.js'
import createSession from '#app/services/session.js'
import createPlan from '#app/services/plan.js'
import createQs from '#app/services/qs.js'
import createIo from '#app/services/io.js'
import App from '#app/index.vue'

export default createApp(App, async (app, data) => {



    // -------------------
    // Context
    // -------------------

    const ctx = {};
    ctx.ssr = import.meta.env.SSR;
    ctx.state = ctx.ssr ? data : reactive(data); // reactivity not working in SSR and state.server should not be reactive
    ctx.head = createHead();
    ctx.overlay = createOverlay();
    ctx.api = createAPI(ctx);
    ctx.content = await createContent(ctx);
    ctx.qs = createQs(ctx);
    ctx.plan = createPlan(ctx);
    ctx.router = createRouter(ctx);
    ctx.crisp = createCrisp(ctx);
    ctx.io = createIo(ctx);

    await createSession(ctx);



    // -------------------
    // Components
    // -------------------

    const globals = {
        ...ui,
        ...units,
        ...layout,
        ...modals,
        ...inputs,
        ...landings
    }

    Object.keys(globals).forEach(name => {
        app.component(name, globals[name])
    })



    // -------------------
    // Setup
    // -------------------

    app.use(ctx.head);
    app.use(ctx.router);
    app.provide('api', ctx.api);
    app.provide('ssr', ctx.ssr);
    app.provide('content', ctx.content);
    app.provide('state', ctx.state);
    app.provide('overlay', ctx.overlay);
    app.provide('crisp', ctx.crisp);
    app.provide('plan', ctx.plan);
    app.provide('io', ctx.io);
    app.mount('body');



})