<!--
    Styles
-->

<style lang="scss">



</style>



<!--
    Template
-->

<template>
    <l-filter search="candidates" :form="form" :tags="tags" :suggestions="filters.suggestions" >

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-candidate
                v-for="item in list" :key="item.id" :value="item"
                heading="h2"
                class="tile"
                :to="{ name: 'candidate', params: { id: item.id, slug: item.slug } }"
            />
        </l-list>

    </l-filter>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRouter } from 'vue-router'
    import { FILTERS_CANDIDATES } from '@vacature/shared/constants.js'
    import { usePreload, useText, useForm, useMeta, useFilters, getListText } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            // loaded inside "preload" for use in "qs"
        ],

        texts: [
            'l-filter',
            'route-candidates'
        ],

        async preload ({ content, api, qs, places, i18n, state }, to) {

            await content.loadLists([
                'genders',
                'education_fields',
                'education_levels',
            ])

            const limit = 10;
            const page = qs.integer(to.query.page, 1);
            const search = qs.string(to.query.search);
            const gender = qs.item(to.query.gender, 'genders');
            const education_level = qs.item(to.query.education_level, 'education_levels');
            const education_field = qs.item(to.query.education_field, 'education_fields');

            return {
                limit,
                query: { page, search, education_level, education_field, gender },
                list: api('candidates-list').fetch({ limit, page, search, education_level, education_field, gender }),
                count: api('candidates-count').fetch({ search, education_level, education_field, gender }),
            }

        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-candidates');
    const data = usePreload();
    const filters = useFilters(data, FILTERS_CANDIDATES);
    const form = useForm('candidates', { t, filters })
    const router = useRouter();

    const tags = {
        education_field: value => getListText(filters.education_fields, value),
        education_level: value => getListText(filters.education_levels, value),
        gender: value => getListText(filters.genders, value),
        search: value => value
    }

    useMeta()



</script>