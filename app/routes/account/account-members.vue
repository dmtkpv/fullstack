<!--
    Styles
-->

<style lang="scss">


</style>



<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <ui-button :text="t('BUTTON_CREATE')" :to="{ name: 'account-member', params: { id: '+' } }" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-member
                v-for="item in data.list"
                class="tile"
                heading="h2"
                actions
                :key="item.id"
                :value="item"
                :class="{ _disabled: item._disabled }"
                :to="{ name: 'account-member', params: { id: item.id } }"
                @delete="remove"
                @edit="edit"
            />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useText, useMeta } from '#app/services/utils'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'm-confirm',
            'unit-member',
            'route-account-members'
        ],

        preload ({ api, state, qs, plan }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);

            return {
                limit,
                query: { page },
                list: api('account-members-list').fetch({ limit, page }),
                count: api('account-members-count').fetch()
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-members')
    const data = usePreload();
    const router = useRouter();
    const del = useAPI('account-members-delete');



    // -------------------
    // Actions
    // -------------------

    function edit ({ id }) {
        router.push({ name: 'account-member', params: { id } });
    }

    async function remove (item) {
        item._disabled = true;
        await del.quiet(item.id);
        await router.push({ query: { ...data.query, t: Date.now() } })
    }

    useMeta();



</script>