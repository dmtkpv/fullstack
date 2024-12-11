<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </header>

        <l-form
            class="tile"
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :defaults="data.company"
            :loading="save.pending"
            :error="save.error"
            @submit="save.quiet(edits)"
         />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { usePreload, useAPI, useUser, useForm, useText, empty, useMeta, useLists } from '#app/services/utils'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'i-image',
            'route-account-company'
        ],

        lists: [
            'branches'
        ],

        preload ({ api }) {
            return {
                company: api('account-company-item').fetch(),
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-company')
    const data = usePreload();
    const user = useUser();
    const lists = useLists();
    const form = useForm('company', { t, lists });
    const save = useAPI('account-company-update');
    const edits = reactive({});



    // -------------------
    // Hooks
    // -------------------

    save.onSuccess(() => {
        Object.assign(data.company, edits);
        empty(edits);
    })

    useMeta();



</script>