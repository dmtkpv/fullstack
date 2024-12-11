<!--
    Styles
-->

<style lang="scss">

    .ajNf89 {

        .unit-member {
            margin-bottom: 32px;
        }

    }


</style>



<!--
    Template
-->

<template>
    <section class="ajNf89">

        <header class="heading">
            <h1 class="h3">
                <span v-if="data.id">{{ t('HEADING_UPDATE') }}</span>
                <span v-else>{{ t('HEADING_CREATE') }}</span>
            </h1>
        </header>

        <unit-member
            v-if="data.id"
            class="tile"
            heading="h2"
            :value="data.member"
        />

        <l-form
            class="tile"
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :defaults="data.member"
            :loading="pending"
            :error="error"
            @submit="submit"
        />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useForm, useText, useUser, watchPlace, empty, useMeta } from '#app/services/utils'




    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-member'
        ],

        preload ({ api, qs, plan }, to) {
            const id = qs.uuid(to.params.id)
            const member = id ? api('account-members-item').fetch(id) : reactive({});
            const locations = api('account-locations-list').fetch();
            return { id, member, locations }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-member')
    const edits = reactive({})
    const user = useUser();
    const data = usePreload();
    const form = useForm('member', { t, data });
    const save = useAPI('account-members-upsert');
    const location = useAPI('account-locations-create');
    const router = useRouter();
    const error = ref();

    const pending = computed(() => {
        return save.pending || location.pending
    })



    // -------------------
    // Submit
    // -------------------

    async function post () {
        const { place_id } = edits;
        if (place_id) {
            const item = await location.fetch({ place_id });
            data.locations.push(item);
            edits.locations = [item.id];
            delete edits.place_id;
        }
        await save.fetch(data.id, edits)
    }

    function onSuccess () {
        empty(edits);
        router.push({ name: 'account-members' });
    }

    function onError (e) {
        error.value = e;
    }

    function submit () {
        post().then(onSuccess).catch(onError)
    }



    // -------------------
    // Hooks
    // -------------------

    watchPlace(() => edits.place_id, ({ geometry }) => {
        data.member.geometry = geometry;
    })

    useMeta();



</script>