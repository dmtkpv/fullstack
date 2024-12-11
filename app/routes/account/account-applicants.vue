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
            <i-select v-model="job" :list="data.jobs" :placeholder="t('JOBS_PLACEHOLDER')" :clear="t('JOBS_CLEAR')" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <l-table v-bind="table" :data="list" @click="view" @view="view" @delete="remove" />
        </l-list>
        
    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, defineOptions } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useUser, useTable, useText, useMeta, useIoReload } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'm-confirm',
            'route-account-applicants'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const job = qs.integer(to.query.job);
            const page = qs.integer(to.query.page);

            return {
                limit,
                query: { job, page },
                jobs: api('account-applications-jobs').fetch(),
                list: api('account-applications-list').fetch({ limit, page, job }),
                count: api('account-applications-count').fetch({ job }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-applicants')
    const data = usePreload();
    const user = useUser();
    const table = useTable('applicants', { t });
    const router = useRouter();
    const del = useAPI('account-applications-delete');

    const job = computed({
        get: () => data.query.job,
        set: job => router.push({ query: { job } })
    })



    // -------------------
    // Actions
    // -------------------

    function view ({ room }) {
        router.push({ name: 'account-room', params: { id: room } });
    }

    async function remove (row) {
        row._disabled = true;
        await del.quiet(row.id);
        await router.push({ query: { ...data.query, t: Date.now() } })
    }

    useMeta();
    useIoReload();



</script>