<!--
    Styles
-->

<style lang="scss">

</style>


<!--
    Template
-->

<template>
    <div class="l-table_job">
        <p class="h5 break">{{ value.title }}</p>
        <p class="break">{{ value.address }}</p>
    </div>
</template>


<!--
    Scripts
-->

<script setup>

    defineProps([
        'value'
    ])

</script>