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
            <unit-candidate
                v-for="item in list" :key="item.id"
                class="tile"
                heading="h2"
                :value="item"
                :to="{ name: 'candidate', params: { id: item.id } }"
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
            'education_fields',
            'education_levels',
        ],

        texts: [
            'route-account-favorite-candidates'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);

            return {
                limit,
                query: { page },
                count: api('account-favorite-users-count').fetch(),
                list: api('account-favorite-users-list').fetch({ limit, page })
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-favorite-candidates' )
    const data = usePreload();
    const router = useRouter();

    function refresh (value) {
        !value && router.push({ query: { ...data.query, t: Date.now() } })
    }

    useMeta();


</script>