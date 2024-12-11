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
            <i-input v-model="search" icon="lg-search" :placeholder="t('SEARCH_PLACEHOLDER')" />
            <i-select v-model="status" :list="statuses" :placeholder="t('STATUS_PLACEHOLDER')" :clear="t('STATUS_CLEAR')" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <l-table v-bind="table" :data="list" @click="click" />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useText, useTable, useMeta, useStatuses, useIoReload } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-applications'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const status = qs.oneof(to.query.status, ['PENDING', 'APPROVED', 'REJECTED']);
            const search = qs.string(to.query.search);

            return {
                limit,
                query: { status, search, page },
                list: api('account-applications-list').fetch({ limit, page, search, status }),
                count: api('account-applications-count').fetch({ search, status }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-applications');
    const data = usePreload();
    const table = useTable('applications', { t });
    const router = useRouter();
    const statuses = useStatuses({ t });

    const status = computed({
        get: () => data.query.status,
        set: status => router.push({ query: { ...data.query, page: 1, status } })
    })

    const search = computed({
        get: () => data.query.search,
        set: search => router.push({ query: { ...data.query, page: 1, search } })
    })

    function click ({ room }) {
        router.push({ name: 'account-room', params: { id: room } });
    }

    useMeta();
    useIoReload();



</script>