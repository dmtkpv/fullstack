<!--
    Styles
-->

<style lang="scss">

    .ui-html {

        p, ul {
            margin: 1em 0;
        }

        & > *:first-child {
            margin-top: 0;
        }


    }

</style>


<!--
    Template
-->

<template>
    <div class="ui-html break" v-html="html" />
</template>


<!--
    Scripts
-->

<script setup>

    defineProps([
        'html'
    ])

</script>