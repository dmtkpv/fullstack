import { reactive, markRaw } from 'vue'
import modals from '#app/config/modals.js'

export default function () {



    // -------------------
    // Options
    // -------------------

    const defaults = {
        active: false,
        attrs: null,
        name: null,
        component: null,
    }



    // -------------------
    // Modal
    // -------------------

    const modal = reactive({

        ...defaults,

        show (name, attrs) {
            const data = modals.find(data => data.name === name);
            if (!data) throw new Error(`Config for modal "${name}" not found`);
            modal.active = true;
            modal.attrs = attrs;
            modal.name = data.name;
            modal.component = markRaw(data.component);
            modal.noOutsideClick = data.noOutsideClick;
        },

        hide () {
            modal.active = false;
        }

    })



    // -------------------
    // Sidebar
    // -------------------

    const sidebar = reactive({

        ...defaults,

        show ({ active, attrs, name, component }) {
            sidebar.active = active;
            sidebar.attrs = attrs;
            sidebar.name = name;
            sidebar.component = markRaw(component);
        },

        hide () {
            sidebar.active = false;
        }

    })



    // -------------------
    // Exports
    // -------------------

    return {
        modal,
        sidebar
    }



}