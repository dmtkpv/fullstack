<!--
    Styles
-->

<style lang="scss">

    .l-table_application {

        display: flex;
        align-items: center;

        .ui-image {
            width: 48px;
            margin-right: 12px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="l-table_application">
        <ui-image :uuid="value.company.image" default="company" type="square" />
        <div>
            <p class="h5">{{ value.job.title }}</p>
            <p>{{ value.company.name }}</p>
        </div>
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