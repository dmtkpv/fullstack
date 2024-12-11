<!--
    Styles
-->

<style lang="scss">

    .MyWzEd {

        display: flex;
        margin-bottom: 16px;
        padding: 16px;
        align-items: center;

        & > svg {
            flex-shrink: 0;
        }

        h2 {
            flex-grow: 1;
            padding: 0 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <ui-button :text="t('BUTTON_CREATE')" @click="add" />
        </header>

        <l-list v-bind="data" :t="t">
            <router-link class="tile MyWzEd" v-for="item in data.list" :key="item.id" :class="{ _disabled: item._disabled }" :to="{ name: 'account-location', params: { id: item.id } }">
                <ui-icon value="lg-location" type="md" />
                <h2>{{ item.address }}</h2>
                <ui-actions :value="actions" @edit="edit(item)" @delete="onDelete(item)" />
            </router-link>
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useText, usePlan, useModal, useMeta } from '#app/services/utils'




    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'm-confirm',
            'route-account-locations'
        ],

        preload ({ api, qs, state }, to) {
            const limit = 10;
            const page = qs.integer(to.query.page);
            return {
                limit,
                query: { page },
                list: api('account-locations-list').fetch({ limit, page }),
                count: api('account-locations-count').fetch(),
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-locations');
    const data = usePreload();
    const plan = usePlan();
    const router = useRouter();
    const modal = useModal();
    const del = useAPI('account-locations-delete');

    const actions = [
        { text: t('ACTION_EDIT'), value: 'edit' },
        { text: t('ACTION_DELETE'), value: 'delete' }
    ]



    // -------------------
    // Actions
    // -------------------

    function add () {
        const can = plan.hasLocations(data.count);
        if (can) router.push({ name: 'account-location', params: { id: '+' } })
        else modal.show('premium', { type: 'locations' });
    }

    function edit ({ id }) {
        router.push({ name: 'account-location', params: { id } })
    }

    async function remove (location) {
        location._disabled = true;
        await del.quiet(location.id);
        await router.push({ query: { ...data.query, t: Date.now() } })
    }

    function onDelete (location) {
        modal.show('confirm', {
            onSuccess: () => remove(location)
        });
    }

    useMeta();



</script>