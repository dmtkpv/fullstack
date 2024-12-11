<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <i-input v-model="search" icon="lg-search" :placeholder="t('SEARCH_PLACEHOLDER')" />
            <ui-button :text="t('BUTTON_CREATE')" @click="add" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <l-table v-bind="table" :data="list" @click="edit" @edit="edit" @view="view" @delete="remove" />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useUser, useModal, useTable, useText, useMeta } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'm-confirm',
            'route-account-jobs'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const search = qs.string(to.query.search);
            const list = api('account-jobs-list');

            list.onSuccess(data => {
                if (state.user.is_new && !state.user.plan) data.forEach(item => item.publish = null) // inactive status
            })

            return {
                limit,
                query: { page, search },
                list: list.fetch({ limit, page, search }),
                count: api('account-jobs-count').fetch({ search }),
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-jobs')
    const router = useRouter();
    const modal = useModal();
    const user = useUser();
    const table = useTable('jobs', { t });
    const data = usePreload();
    const del = useAPI('account-jobs-delete');

    const search = computed({
        get: () => data.query.search,
        set: search => router.push({ query: { search } })
    })



    // -------------------
    // Actions
    // -------------------

    function add () {
        router.push({ name: 'account-job', params: { id: '+' } });
    }

    async function remove (row) {
        row._disabled = true;
        await del.quiet(row.id);
        await router.push({ query: { ...data.query, t: Date.now() } })
    }

    function view ({ id, slug }) {
        router.push({ name: 'job', params: { id, slug } });
    }

    function edit ({ id }) {
        router.push({ name: 'account-job', params: { id } });
    }

    useMeta();



</script>