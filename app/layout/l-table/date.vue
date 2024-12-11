<!--
    Styles
-->

<style lang="scss">

    .l-table_date {
        white-space: nowrap;
    }

</style>


<!--
    Template
-->

<template>
    <ui-date class="t7 l-table_date" :value="value" />
</template>


<!--
    Scripts
-->

<script setup>

    defineProps([
        'value'
    ])

</script>