<!--
    Styles
-->

<style lang="scss">

    .landing-company {

        position: relative;

        figure {

            left: $padding-x;
            right: $padding-x;
            position: absolute;
            z-index: -1;

            @include sm {
                display: none;
            }

        }

        .ui-button {
            margin: 0 auto;
            max-width: max-content;
        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-company container-md">

        <figure>
            <img src="/landing/company.svg?url">
        </figure>

        <landing-heading
            :title="t('HEADING')"
            :note="t('DESCRIPTION')"
        />

        <section>
            <ui-button :text="t('BUTTON')" :to="{ name: 'premium' }" />
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'
    const t = useText('landing-company');

</script>