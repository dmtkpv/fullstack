<!--
    Styles
-->

<style lang="scss">

    .pRG1PT {

        .i-search {
            margin: 32px 0 16px 0;
        }

        .link {
            font-weight: $w6;
            margin-left: 4px;
            &:not(:last-child):after { content: ',' }
        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="landing">


        <!-- hero -->

        <landing-hero class="pRG1PT">

            <h1 class="h1" v-html="t('HEADING')" />
            <i-search route="jobs" :suggestions="filters.suggestions" :placeholder="t(`SEARCH_PLACEHOLDER`)" />

            <p>
                <span>{{ t('SUGGESTIONS') }}:</span>
                <router-link class="link" v-for="search in suggestions" :to="{ name: 'jobs', query: { search } }">{{ search }}</router-link>
            </p>

        </landing-hero>


        <!-- sections -->

        <landing-features :value="features" />
        <landing-locations v-if="data.locations.length" :locations="data.locations" />
        <landing-mobile />
        <landing-company />
        <landing-contact />
        <landing-footer />


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { onMounted } from 'vue'
    import { FILTERS_JOBS } from '@vacature/shared/constants.js'
    import { useText, useMeta, usePreload, useCrisp, useFilters } from '#app/services/utils.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'route-home',
            'landing-locations',
            'landing-mobile',
            'landing-company',
            'landing-contact',
            'landing-footer'
        ],

        lists: [
            'education_fields',
            'education_levels',
            'education_paths',
            'job_types',
            'branches'
        ],

        preload ({ api }) {
            return {
                locations: api('content-locations').fetch(),
                count: api('jobs-count').fetch()
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-home');
    const data = usePreload();
    const crisp = useCrisp();
    const filters = useFilters(data, FILTERS_JOBS);

    const suggestions = [
        t('SUGGESTION_1'),
        t('SUGGESTION_2'),
        t('SUGGESTION_3'),
    ]

    const feature_1 = {
        image: '/landing/feature-1.png',
        title: t('FEATURE_1_HEADING'),
        note: t('FEATURE_1_DESCRIPTION'),
    }

    const feature_2 = {
        image: '/landing/feature-2.png',
        title: t('FEATURE_2_HEADING'),
        note: t('FEATURE_2_DESCRIPTION'),
    }

    const feature_3 = {
        image: '/landing/feature-3.png',
        title: t('FEATURE_3_HEADING'),
        note: t('FEATURE_3_DESCRIPTION'),
    }

    const features = {
        title: t('FEATURES_HEADING'),
        note: t('FEATURES_DESCRIPTION'),
        columns: [feature_1, feature_2, feature_3]
    }



    // -------------------
    // Hooks
    // -------------------

    useMeta();

    onMounted(async () => {
        crisp.show();
    })



</script>