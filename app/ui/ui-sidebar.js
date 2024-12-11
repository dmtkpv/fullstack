import { watch, computed, onUnmounted } from 'vue'
import { useOverlay } from '#app/services/utils.js'

export default {

    props: [
        'modelValue'
    ],

    emits: [
        'update:modelValue'
    ],

    setup (props, { attrs, emit, slots }) {

        const sidebar = useOverlay('sidebar');

        const active = computed({
            get: () => props.modelValue,
            set: value => emit('update:modelValue', value)
        })

        const current = {
            name: Symbol(),
            attrs,
            active,
            component: slots.default
        }

        watch(active, value => {
            if (!value) return;
            if (sidebar.name === current.name) return;
            if (sidebar.active) sidebar.active = false;
            sidebar.show(current);
        }, { immediate: true })

        onUnmounted(() => {
            if (sidebar.name !== current.name) return;
            delete sidebar.active; // sidebar.hide() not working because computed.get not triggering
        })

        return () => undefined

    }

}