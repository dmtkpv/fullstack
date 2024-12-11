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
            :defaults="data.location"
            :loading="save.pending"
            :disabled="!edits.place_id"
            :error="save.error"
            @submit="submit"
        />

    </section>
</template>



<!--
    Scripts
-->

<script setup>


    import { watch, reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useForm, useText, usePlan, useModal, watchPlace, empty, useMeta } from '#app/services/utils'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'route-account-location'
        ],

        preload ({ api, qs }, to) {
            const id = qs.integer(to.params.id)
            const location = id ? api('account-locations-item').fetch(id) : reactive({});
            const count = api('account-locations-count').fetch();
            return { id, location, count }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-location');
    const edits = reactive({});
    const data = usePreload();
    const router = useRouter();
    const modal = useModal();
    const plan = usePlan();
    const form = useForm('location', { t, data })
    const save = useAPI('account-locations-upsert');



    // -------------------
    // Actions
    // -------------------

    function submit () {
        if (data.id || plan.hasLocations(data.count)) save.quiet(data.id, edits);
        else modal.show('premium', { type: 'locations' })
    }



    // -------------------
    // Hooks
    // -------------------

    watchPlace(() => edits.place_id, ({ geometry }) => {
        data.location.geometry = geometry;
    })

    save.onSuccess(() => {
        empty(edits);
        router.push({ name: 'account-locations' })
    })

    useMeta();



</script>