<!--
    Template
-->

<template>
    <component :is="component" v-bind="options?.[component]">
        <slot />
    </component>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, onMounted, ref } from "vue";
    import { getProp } from '#app/services/utils'

    const props = defineProps([
        'type',
        'lg',
        'md',
        'sm',
        'options'
    ])

    const md = getProp('--md');
    const sm = getProp('--sm');
    const size = ref('lg');

    const component = computed(() => {
        return props[size.value] || props.type;
    })

    function setSize () {
        if (window.innerWidth > md) size.value = 'lg';
        else if (window.innerWidth > sm) size.value = 'md';
        else size.value = 'sm';
    }

    onMounted(() => {
        window.addEventListener('resize', setSize)
        setSize();
    })


</script>