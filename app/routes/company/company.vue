<!--
    Styles
-->

<style lang="scss">



    // --------------------
    // Hero
    // --------------------

    .BA3L8r {

        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: $padding-y;

        .ui-image {
            width: 128px;
            border-radius: 32px;
        }

        h1 {
            text-align: center;
            margin: 20px 0;
        }

        .row {
            justify-content: center;
        }

    }



    // --------------------
    // About
    // --------------------

    .RBbrCf {

        margin-bottom: $padding-y;

        h2 {
            margin-bottom: 16px;
        }
    }



    // --------------------
    // Jobs
    // --------------------

    .htWaPR {
        margin-bottom: $gap;
    }



</style>



<!--
    Template
-->

<template>
    <main class="container-sm">


        <!-- hero -->

        <article class="BA3L8r">
            <ui-image type="square" :uuid="data.company.image" default="company" />
            <h1 class="h4">{{ data.company.name }}</h1>
            <l-company-buttons :company="data.company" />
        </article>


        <!-- About -->

        <article class="tile _padded RBbrCf" v-if="data.company.about">
            <h2 class="h4">{{ t('HEADING_ABOUT') }}</h2>
            <ui-html :html="data.company.about" />
        </article>


        <!-- Jobs -->

        <article>

            <h2 class="h4 htWaPR">{{ render(t('HEADING_JOBS'), data) }}</h2>

            <l-list v-bind="data" :t="t" v-slot="{ list }">
                <unit-job
                    v-for="job in list"
                    class="tile"
                    heading="h3"
                    :value="job"
                    :to="{ name: 'job', params: { id: job.id, slug: job.slug }}"
                />
            </l-list>

        </article>


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useText, render, useMeta, checkSlug } from '#app/services/utils.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        lists: [
            'job_types'
        ],

        texts: [
            'unit-job',
            'l-company-buttons',
            'route-company',
            'm-message'
        ],

        preload ({ api, state, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);

            return {
                limit,
                query: { page },
                company: api('companies-item').fetch(to.params.id),
                list: api('companies-item-jobs-list').fetch(to.params.id, { limit, page }),
                count: api('companies-item-jobs-count').fetch(to.params.id),
            }
        },

        redirect (to) {
            return checkSlug(to, 'company');
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-company');
    const data = usePreload();
    const router = useRouter();
    const phone = ref(false);

    const page = computed({
        get: () => data.query.page,
        set: page => router.push({ query: { page } })
    })

    useMeta(data.company)



</script>