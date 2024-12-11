<!--
    Styles
-->

<style lang="scss">

    .KuhDk7 {
        margin-top: $gap;
    }

</style>



<!--
    Template
-->

<template>
    <main class="container-sm">

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </header>

        <unit-job
            class="tile"
            heading="h2"
            :value="data.job"
            :to="{ name: 'job', params: { id: data.job.id, slug: data.job.slug }}"
        />

        <l-form
            class="tile KuhDk7"
            label="h5"
            :value="edits"
            :button="t('BUTTON')"
            :form="form"
            :loading="apply.pending"
            :error="apply.error"
            @submit="apply.quiet(edits)"
        />

    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useUser, useForm, useText, empty, useMeta, checkSlug } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'job_types'
        ],

        texts: [
            'unit-job',
            'route-job-apply'
        ],

        preload ({ api }, to) {
            return {
                cvs: api('account-cvs-list').fetch(),
                job: api('jobs-item').fetch(to.params.id),
                room: api('account-rooms-name').fetch({ job: to.params.id }),
            }
        },

        redirect (to) {
            const { id } = to.meta.preload.room;
            if (id) return { name: 'account-room', params: { id, } };
            return checkSlug(to, 'job');
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-job-apply');
    const data = usePreload();
    const form = useForm('apply', { t, data })
    const router = useRouter();
    const user = useUser()
    const apply = useAPI('account-messages-create');

    const edits = reactive({
        attachment: null,
        template: 'APPLICATION_CREATED',
        room: data.room
    });



    // -------------------
    // Hooks
    // -------------------

    apply.onSuccess(() => {
        empty(edits);
        router.push({ name: 'account-applications' })
    })

    useMeta(data.job)



</script>