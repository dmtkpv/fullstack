<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <p class="ui-date">{{ date }}</p>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, onMounted, onServerPrefetch, watch } from 'vue'

    const props = defineProps({
        value: {
            type: String,
            required: true
        },
        format: {
            type: String,
            default: 'date-time',
            validator: (value) => ['date-time', 'date', 'time'].includes(value),
        }
    });

    const date = ref(null);

    function parse (timestamp) {
        const options = {};
        if (props.format.includes('date')) options.dateStyle = 'short';
        if (props.format.includes('time')) options.timeStyle = 'short';
        return new Intl.DateTimeFormat('nl', options).format(new Date(timestamp))
    }

    function sync () { // fixes server/client timezone diff
        watch(() => props.value, value => {
            date.value = parse(value);
        }, { immediate: true })
    }

    onMounted(sync);
    onServerPrefetch(sync);

</script>