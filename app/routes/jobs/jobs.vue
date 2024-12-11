<!--
    Styles
-->

<style lang="scss">

    .LsWhLW {
        width: 160px;
    }

</style>



<!--
    Template
-->

<template>
    <l-filter search="jobs" :form="form" :tags="tags" :suggestions="filters.suggestions" >


        <!-- header -->

        <template #header>
            <i-select class="LsWhLW" :list="sorts" v-model="sort" />
        </template>


        <!-- list -->

        <l-list v-bind="data" :count="data.count.total" :t="t" v-slot="{ list }">
            <unit-job
                v-for="job in list"
                class="tile"
                heading="h2"
                :key="job.id"
                :value="job"
                :to="{ name: 'job', params: { id: job.id, slug: job.slug }}"
            />
        </l-list>


    </l-filter>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { FILTERS_JOBS } from '@vacature/shared/constants.js'
    import { useForm, usePreload, useText, useMeta, useFilters, getListText } from '#app/services/utils'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        lists: [
            // loaded inside "preload" for use in "qs"
        ],

        texts: [
            'route-jobs',
            'unit-job',
            'i-slider',
            'l-filter'
        ],

        async preload ({ api, qs, state, content, cache }, to, from) {

            await content.loadLists([
                'education_fields',
                'education_levels',
                'education_paths',
                'job_types',
                'branches'
            ])

            const limit = 10;
            const page = qs.integer(to.query.page);
            const search = qs.string(to.query.search);
            const data = qs.string(to.query.data);
            const location = qs.string(to.query.location);
            const distance = qs.integer(to.query.distance);
            const hour = qs.oneof(qs.integer(to.query.hour), HOURS);
            const branch = qs.item(to.query.branch, 'branches');
            const education_field = qs.item(to.query.education_field, 'education_fields');
            const education_level = qs.item(to.query.education_level, 'education_levels');
            const education_path = qs.item(to.query.education_path, 'education_paths');

            let sort = qs.oneof(qs.integer(to.query.sort), [1, 2, 3, 4]) || 1;
            if (!location && sort > 2) sort = 1;
            if (location && !from.query.location) sort = 3;

            const filter = { data, distance, branch, education_field, education_level, education_path, search }
            const query = { page, sort, hour, location, ...filter }
            const place = {};

            if (hour) {
                filter.date = new Date();
                filter.date.setTime(filter.date.getTime() - hour * 60 * 60 * 1000);
            }

            if (location) {
                const cached = from.query.location === location && cache.place;
                if (!cached) cache.place = await api('places-item').fetch(location, { fields: ['name', 'geometry'] });
                filter.location = cache.place.geometry;
                place.name = cache.place.name;
            }

            return {
                limit,
                query,
                place,
                list: api('jobs-list').fetch({ limit, page, sort, ...filter }),
                count: api('jobs-count').fetch(filter)
            }

        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-jobs');
    const data = usePreload();
    const route = useRoute();
    const router = useRouter();
    const filters = useFilters(data, FILTERS_JOBS);
    const form = useForm('jobs', { HOURS, t, data, filters })

    const sorting = [
        { value: 1, text: t('SORT_NEWEST') },
        { value: 2, text: t('SORT_OLDEST') },
        { value: 3, text: t('SORT_NEAREST') },
        { value: 4, text: t('SORT_FURTHEST') },
    ]

    const tags = {
        location: value => data.place.name,
        distance: value => `${value}km`,
        branch: value => getListText(filters.branches, value),
        education_field: value => getListText(filters.education_fields, value),
        education_level: value => getListText(filters.education_levels, value),
        education_path: value => getListText(filters.education_paths, value),
        hour: value => t(`HOURS_${value}`),
        search: value => value
    }

    const sorts = computed(() => {
        const index = data.query.location ? 4 : 2;
        return sorting.slice(0, index);
    })

    const sort = computed({
        get: () => data.query.sort,
        set: sort => router.push({ query: { ...route.query, sort, page: 1 } })
    })

    useMeta();

</script>



<!--
    Options
-->

<script>

    const HOURS = [24, 168, 336, 720];


</script>