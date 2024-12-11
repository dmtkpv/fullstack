<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-job
                v-for="job in list" :key="job.id"
                class="tile"
                heading="h2"
                :value="job"
                :to="{ name: 'job', params: { id: job.id, slug: job.slug }}"
                @bookmark="refresh"
            />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRouter } from 'vue-router'
    import { usePreload, useText, useMeta } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'job_types'
        ],

        texts: [
            'unit-job',
            'route-account-favorite-jobs'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);

            return {
                limit,
                query: { page },
                list: api('account-favorite-jobs-list').fetch({ limit, page }),
                count: api('account-favorite-jobs-count').fetch()
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-favorite-jobs')
    const data = usePreload();
    const router = useRouter();



    // -------------------
    // Actions
    // -------------------

    function refresh (value) {
        !value && router.push({ query: { ...data.query, t: Date.now() } })
    }

    useMeta();



</script>