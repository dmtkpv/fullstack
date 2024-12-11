import { ref, watch } from 'vue'

export default function ({ ssr, router }) {

    const active = ref(false);

    if (!ssr) {
        window.CRISP_RUNTIME_CONFIG = { locale : 'nl' };
        window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
        window.$crisp = [];
        window.$crisp.push(['on', 'session:loaded', style])
    }

    function style () {
        const $el = document.querySelector('.crisp-client');
        if ($el) $el.style.display = active.value ? '' : 'none';
    }

    function load () {
        const src = 'https://client.crisp.chat/l.js'
        let script = document.head.querySelector(`script[src='${src}']`);
        if (script) return;
        script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }

    function show () {
        load();
        active.value = true;
    }

    function toggle () {
        window.$crisp.push(['do', 'chat:toggle'])
    }

    router.afterEach(() => {
        active.value = false;
    })

    watch(active, () => {
        style();
    })

    return {
        show,
        toggle
    }

}