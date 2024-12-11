<!--
    Styles
-->

<style lang="scss">

    .tcN2IN {

        #salary_frequency {
            flex: 0 0 50%;
        }

    }


</style>



<!--
    Template
-->

<template>
    <section class="tcN2IN">

        <header class="heading">
            <h1 class="h3">
                <span v-if="data.id">{{ t('HEADING_UPDATE') }}</span>
                <span v-else>{{ t('HEADING_CREATE') }}</span>
            </h1>
        </header>

        <l-form
            class="tile"
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :defaults="data.job"
            :loading="pending"
            :error="error"
            @submit="submit" />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive, computed, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { MBO } from '@vacature/shared/constants.js'
    import { usePreload, useAPI, useForm, useUser, useModal, usePlan, useText, watchPlace, empty, useMeta, useSSR, useLists } from '#app/services/utils.js'




    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'hours_frequencies',
            'salary_frequencies',
            'categories',
            'job_types',
            'education_levels',
            'education_fields',
            'education_paths',
        ],

        texts: [
            'm-confirm',
            'route-account-job',
            'item-file'
        ],

        preload ({ api, qs, state }, to) {
            const id = qs.integer(to.params.id);
            const job = id ? api('account-jobs-item').fetch(id) : reactive({});
            const locations = api('account-locations-list').fetch({ limit: 100 });
            const premium = api('account-jobs-premium-count').fetch();
            const images = api('account-job-images-list').fetch(id);
            return { id, job, locations, premium, images }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-job');
    const ssr = useSSR();
    const edits = reactive({});
    const data = usePreload();
    const router = useRouter();
    const modal = useModal();
    const user = useUser();
    const plan = usePlan();
    const lists = useLists();
    const form = useForm('job', { t, data, edits, user, lists });
    const save = useAPI('account-jobs-upsert');
    const location = useAPI('account-locations-create');
    const error = ref(undefined);

    const pending = computed(() => {
        return save.pending || location.pending
    })

    const premium = computed(() => {
        return plan.hasJobs(data.premium);
    })



    // -------------------
    // Submit
    // -------------------

    async function post () {
        const { place_id } = edits;
        if (place_id) {
            const item = await location.fetch({ place_id });
            data.locations.push(item);
            edits.location = item.id;
            delete edits.place_id;
        }
        await save.fetch(data.id, edits)
    }

    function onSuccess () {
        if (edits.location) localStorage.setItem('job.location', edits.location);
        empty(edits);
        router.push({ name: 'account-jobs' })
    }

    function onError (e) {
        error.value = e;
    }

    function submit () {
        if (user.is_new && !user.plan) modal.show('premium', { type: 'new-company-jobs' });
        else post().then(onSuccess).catch(onError)
    }



    // -------------------
    // Hooks
    // -------------------

    watchPlace(() => edits.place_id, ({ geometry }) => {
        data.job.geometry = geometry;
    })

    watch(() => edits.premium, value => {
        if (!value) return;
        if (premium.value) return;
        edits.premium = false;
        modal.show('premium', { type: 'jobs' });
    })

    watch(() => edits.urgent, value => {
        if (!value) return;
        if (user.plan) return;
        edits.urgent = false;
        modal.show('premium', { type: 'urgent' });
    })

    watch(() => edits.education_levels, levels => {
        if (!levels) return;
        const mbo = levels.some(value => MBO.includes(value));
        if (!mbo) edits.education_paths = [];
    })

    useMeta();



    // -------------------
    // Set defaults
    // -------------------

    watch(() => data.id, id => {

        empty(edits);

        if (!id) {
            edits.premium = premium.value;
            edits.publish = true;
            edits.hours_frequency = lists.hours_frequencies[1].value;
            edits.salary_frequency = lists.salary_frequencies[0].value;
        }

        if (!id && !ssr && data.locations.length) {
            const cached = +localStorage.getItem('job.location');
            const location = data.locations.find(location => location.id === cached) || data.locations[0];
            edits.location = location.id;
        }

    }, { immediate: true })



</script>