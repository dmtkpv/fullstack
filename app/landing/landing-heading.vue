<!--
    Styles
-->

<style lang="scss">

    .landing-heading {

        text-align: center;
        margin-bottom: 48px;

        p {
            margin-top: 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <header class="landing-heading">
        <h2 v-if="title" class="h3">{{ title }}</h2>
        <p v-if="note">{{ note }}</p>
    </header>
</template>



<!--
    Scripts
-->

<script setup>

    defineProps([
        'title',
        'note'
    ])

</script>