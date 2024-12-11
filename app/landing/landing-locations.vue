<!--
    Styles
-->

<style lang="scss">

    .landing-locations {

        section {

            display: grid;
            grid-gap: 24px;

            @include lg {
                grid-template-columns: repeat(4, 1fr);
            }

            @include md {
                grid-template-columns: repeat(2, 1fr);
            }

        }

        a {

            display: flex;
            align-items: center;
            padding: 24px;

            .ui-image {
                width: 48px;
                margin-right: 16px;
            }

            h3 {
                flex-grow: 1;
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-locations container-md">

        <landing-heading
            :title="t('HEADING')"
            :note="t('DESCRIPTION')"
        />

        <section>
            <router-link class="tile" v-for="{ image, title, place_id } in locations" :to="{ name: 'jobs', query: { location: place_id }}">
                <ui-image :uuid="image" />
                <h3 class="h5">{{ title }}</h3>
                <ui-icon value="sm-next" />
            </router-link>
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'

    defineProps([
        'locations'
    ])

    const t = useText('landing-locations');

</script>