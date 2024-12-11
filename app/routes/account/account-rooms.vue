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
            <h1 class="h3">Messages</h1>
            <i-select v-model="read" :list="filter" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-room
                v-for="room in list"
                class="tile"
                heading="h2"
                :key="room.id"
                :value="room"
                :to="{ name: 'account-room', params: { id: room.id } }"
            />
        </l-list>

    </section>
</template>


<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useText, useMeta, useIoReload } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'unit-application',
            'route-account-rooms'
        ],

        lists: [
            'education_fields',
            'education_levels'
        ],

        preload ({ api, qs, state }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const read = qs.boolean(to.query.read);

            return {
                limit,
                query: { page, read },
                list: api('account-rooms-list').fetch({ limit, page, read }),
                count: api('account-rooms-count').fetch({ read }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-rooms')
    const data = usePreload();
    const router = useRouter();

    const filter = [
        { text: t('FILTER_ALL'), value: undefined },
        { text: t('FILTER_READ'), value: true },
        { text: t('FILTER_UNREAD'), value: false }
    ]

    const read = computed({
        get: () => data.query.read,
        set: read => router.push({ query: { read } })
    })

    useMeta();
    useIoReload();



</script>