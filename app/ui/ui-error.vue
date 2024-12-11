<!--
    Styles
-->

<style lang="scss">


</style>



<!--
    Template
-->

<template>
    <div class="ui-error alert _error">
        {{ e(value) }}
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useError } from '#app/services/utils.js'

    const props = defineProps([
        'value',
        'form'
    ])

    const e = useError(error => {
        if (!props.form) return;
        const label = error.data?.label;
        if (!label) return;
        error.data.label = props.form.find(field => Object.keys(field.inputs).includes(label))?.label || label;
    });

</script>