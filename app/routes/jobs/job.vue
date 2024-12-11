<!--
    Styles
-->

<style lang="scss">



    // -------------------
    // Root
    // -------------------

    .eUwWiO {

        display: grid;
        gap: $gap;

        @include lg {
            grid-template-columns: 1fr 400px;
            align-items: start;
        }

    }



    // -------------------
    // Hero
    // -------------------

    .D4VyNq {

        @include lg {
            grid-column: span 2;
        }

        @include sm {
            .hero_actions > div:first-child {
                flex-grow: 1;
                button { width: 100% }
            }
        }

    }



    // -------------------
    // Summary
    // -------------------

    .v0BmHP {

        .YWrrs8 {

            display: grid;
            grid-template-columns: auto 1fr;
            margin-top: 24px;

            svg {
                grid-row: 1 / 3;
                align-self: center;
                justify-self: center;
                color: $blue;
                width: 32px;
                margin-right: 16px;
            }

        }

        @include lg {
            grid-area: 2 / 2 / 3 / 3;
        }

    }



    // -------------------
    // Description
    // -------------------

    .tjMIS9 {

        .h3 {
            margin-bottom: 24px;
        }

        .h4 {
            margin-top: 48px;
            display: inline-flex;
            align-items: center;
            svg { margin-right: 4px }
        }

        .row {
            margin: 24px 0;
        }

        @include lg {
            grid-area: 2 / 1 / 3 / 2;
        }

    }



    // -------------------
    // Gallery
    // -------------------

    .OuC0xi {

        display: grid;
        gap: 24px;
        margin-top: 48px;

        @include lg-md {
            grid-template-columns: repeat(4, 1fr);
        }

        @include sm {
            grid-template-columns: repeat(2, 1fr);
        }

        figure {

            position: relative;
            cursor: pointer;

            span {
                @extend %blue;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 12px;
                border-radius: 50%;
                opacity: 0;
                transition: opacity .2s;
                svg {
                    width: 24px;
                    height: 24px;
                }
            }

            img {
                width: 100%;
            }

            &:hover span,
            &._loading span {
                opacity: 1;
            }

        }



    }






</style>



<!--
    Template
-->

<template>
    <main class="eUwWiO container-md">


        <!-- heading -->

        <article class="tile hero D4VyNq">

            <unit-job class="hero_content" :value="data.job" heading="h1" />

            <div class="hero_actions">
                <template v-if="!user.id || user.role === 'candidate'">
                    <ui-auth :roles="['candidate']">
                        <ui-button v-if="data.job.application" type="success" :text="t('BUTTON_APPLIED')" />
                        <ui-button v-else @click="apply" :text="t('BUTTON_APPLY')" />
                    </ui-auth>
                    <ui-auth :roles="['candidate']">
                        <ui-message :job="data.job.id"  icon="lg-message" type="default" />
                    </ui-auth>
                    <ui-bookmark type="job" :value="data.job" button />
                </template>
                <ui-button type="default" :text="t('BUTTON_SHARE')" @click="modal.show('share')" />
            </div>

        </article>


        <!-- summary -->

        <article class="tile _padded v0BmHP">

            <h2 class="h3">{{ t('HEADING_SUMMARY') }}</h2>

            <div class="YWrrs8">
                <ui-icon value="lg-date" type="custom" />
                <h3 class="h6">{{ t('LABEL_DATE') }}</h3>
                <ui-date :value="data.job.updated_at" />
            </div>

            <div v-if="data.job.branches.length" class="YWrrs8">
                <ui-icon value="lg-category" type="custom" />
                <h3 class="h6">{{ t('LABEL_BRANCH') }}</h3>
                <p>{{ getListText(lists.branches, data.job.branches) }}</p>
            </div>

            <div v-if="data.job.type" class="YWrrs8">
                <ui-icon value="lg-time" type="custom" />
                <h3 class="h6">{{ t('LABEL_TYPE') }}</h3>
                <p>{{ getListText(lists.job_types, data.job.type) }}</p>
            </div>

            <div v-if="salary" class="YWrrs8">
                <ui-icon value="lg-salary" type="custom" />
                <h3 class="h6">{{ t('LABEL_SALARY') }}</h3>
                <p>{{ salary }} {{ getListText(lists.salary_frequencies, data.job.salary_frequency) }}</p>
            </div>

            <div v-if="hours" class="YWrrs8">
                <ui-icon value="lg-clock" type="custom" />
                <h3 class="h6">{{ t('LABEL_HOURS') }}</h3>
                <p>{{ hours }} {{ getListText(lists.hours_frequencies, data.job.hours_frequency) }}</p>
            </div>
            <!--
            <div v-if="data.job.experience" class="YWrrs8">
                <ui-icon value="lg-experience" type="custom" />
                <h3 class="h6">{{ t('LABEL_EXPERIENCE') }}</h3>
                <p>{{ data.job.experience }} {{ t('YEARS') }}</p>
            </div>
            -->
            <div v-if="data.job.education_fields.length" class="YWrrs8">
                <ui-icon value="lg-education" type="custom" />
                <h3 class="h6">{{ t('LABEL_EDUCATION_FIELD') }}</h3>
                <p>{{ getListText(lists.education_fields, data.job.education_fields) }}</p>
            </div>

            <div v-if="data.job.education_levels.length" class="YWrrs8">
                <ui-icon value="lg-education" type="custom" />
                <h3 class="h6">{{ t('LABEL_EDUCATION_LEVEL') }}</h3>
                <p>{{ getListText(lists.education_levels, data.job.education_levels) }}</p>
            </div>

            <div v-if="data.job.education_paths.length" class="YWrrs8">
                <ui-icon value="lg-education" type="custom" />
                <h3 class="h6">{{ t('LABEL_EDUCATION_PATH') }}</h3>
                <p>{{ getListText(lists.education_paths, data.job.education_paths) }}</p>
            </div>

            <div v-if="data.job.recruitments" class="YWrrs8">
                <ui-icon value="lg-users" type="custom" />
                <h3 class="h6">{{ t('LABEL_RECRUITMENTS') }}</h3>
                <p>{{ data.job.recruitments }}</p>
            </div>

        </article>


        <!-- content -->

        <article class="tile _padded tjMIS9">

            <h2 class="h3">{{ t('HEADING_DESCRIPTION') }}</h2>
            <ui-html :html="data.job.content" />

            <div class="OuC0xi" v-if="data.job.images.length">
                <figure v-for="(id, index) in data.job.images" :key="id" :class="{ _loading: image === index }" @click="preview(index)">
                    <ui-image type="square" :uuid="id" />
                    <span>
                        <ui-spinner v-if="image === index" />
                        <ui-icon v-else value="lg-plus" type="custom" />
                    </span>
                </figure>
            </div>

            <router-link :to="{ name: 'company', params: { id: data.job.company.id, slug: data.job.company.slug } }">
                <h3 class="h4">
                    <ui-icon value="lg-company" />
                    <span>{{ data.job.company.name }}</span>
                </h3>
            </router-link>


            <p>{{ data.job.address }}</p>

            <l-company-buttons :company="data.job.company" page />
            <ui-map :model-value="data.job.geometry" />

        </article>


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useJob, useLists, useText, useUser, useMeta, useModal, checkSlug, useSSR, getListText } from '#app/services/utils'
    import googleJob from '#app/services/google-job.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        lists: [
            'job_types',
            'branches',
            'education_fields',
            'education_levels',
            'education_paths',
            'salary_frequencies',
            'hours_frequencies',
        ],

        texts: [
            'unit-job',
            'l-company-buttons',
            'route-job',
            'm-message',
            'm-share',
        ],

        preload ({ api, state }, to) {
            return {
                view: api('view-job').quiet(to.params.id),
                job: api('jobs-details').fetch(to.params.id)
            }
        },

        redirect (to) {
            return checkSlug(to, 'job');
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-job');
    const ssr = useSSR();
    const user = useUser();
    const data = usePreload();
    const router = useRouter();
    const modal = useModal();
    const lists = useLists();
    const image = ref(-1);
    let loader;
    const { hours, salary } = useJob(data.job);

    const params = computed(() => {
        const { id, slug } = data.job;
        return { id, slug }
    })



    // -------------------
    // Preview
    // -------------------

    function preview (index) {

        image.value = index;

        loader ??= Promise.all(data.job.images.map(id => new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => resolve(image);
            image.src = `${ADMIN_URL}/assets/${id}`;
        })))

        loader.then(images => {
            modal.show('images', { images, index });
            image.value = -1;
        })

    }



    // -------------------
    // Actions
    // -------------------

    function apply () {
        if (data.job.external && data.job.url) window.open(data.job.url, '_blank').focus();
        else router.push({ name: 'job-apply', params: params.value })
    }



    // -------------------
    // Meta
    // -------------------

    const description = data.job.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 300);

    useMeta({ ...data.job, description }, data.job.premium && {
        script: [{
            type: 'application/ld+json',
            children: JSON.stringify(googleJob(data.job)),
        }]
    });



</script>