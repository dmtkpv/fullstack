<!--
    Styles
-->

<style lang="scss">

    .l-table_applicant {

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
    <div class="l-table_applicant">
        <ui-image :uuid="value.candidate.avatar" default="user" />
        <div>
            <p class="h5">{{ value.candidate.first_name }} {{ value.candidate.last_name }}</p>
            <p>{{ value.job.title }}</p>
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