<!--
    Styles
-->

<style lang="scss">

    .l-list {

        &_nil {

            padding: 96px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
                width: 128px;
                margin-bottom: 32px;
            }

            p {
                font-size: $t5;
                text-align: center;
            }

            .ui-button {
                margin-top: 16px;
            }

        }
    }

</style>



<!--
    Template
-->

<template>


    <!-- list -->

    <template v-if="list.length">
        <slot :list="list" />
        <ui-pager v-model="page" :limit="limit" :total="count"  />
    </template>


    <!-- not found -->

    <div class="l-list_nil tile" v-else>

        <img :src="nil.image">

        <template v-if="filtered">
            <p>{{ t('NIL_TEXT_FILTERED') }}</p>
            <ui-button v-if="nil.reset" :text="t('NIL_RESET')" @click="reset" />
        </template>

        <template v-else>
            <p>{{ t('NIL_TEXT') }}</p>
            <ui-button v-if="nil.create" :text="t('NIL_CREATE')" :to="nil.create" />
        </template>

    </div>


</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useReset } from '#app/services/utils.js'
    import nils from '#app/config/nils.js'

    defineOptions({
        inheritAttrs: false
    })

    const props = defineProps([
        'list',
        'query',
        'count',
        'limit',
        't'
    ])

    const route = useRoute();
    const router = useRouter();
    const reset = useReset();
    const nil = nils[route.name];

    const filtered = computed(() => {
        return Object.values(props.query).some(value => value !== undefined);
    })

    const page = computed({
        get: () => props.query.page,
        set: page => router.push({ query: { ...props.query, page } })
    })


</script>