<!--
    Styles
-->

<style lang="scss" scoped>


</style>



<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <i-select v-model="read" :list="filter" />
        </header>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-notification
                class="tile"
                heading="h2"
                v-for="notification in list"
                :key="notification.id"
                :value="notification" />
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



    // ------------------
    // Preload
    // ------------------

    defineOptions({

        texts: [
            'route-account-notifications'
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const read = qs.boolean(to.query.read);
            const notification = true;

            return {
                limit,
                query: { page, read },
                list: api('account-messages-list').fetch({ limit, page, read, notification }),
                count: api('account-messages-count').fetch({ read, notification }),
            }

        }
    })



    // ------------------
    // Data
    // ------------------

    const t = useText('route-account-notifications')
    const router = useRouter();
    const data = usePreload();

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