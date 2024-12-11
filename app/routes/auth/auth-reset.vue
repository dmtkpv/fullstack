<!--
    Template
-->

<template>
    <m-default class="auth" :title="t('HEADING')">

        <div v-if="reset.success">{{ render(t('SUCCESS'), edits) }}</div>

        <template v-else>

            <l-form
                :button="t('BUTTON')"
                :value="edits"
                :form="form"
                :error="reset.error"
                :loading="reset.pending"
                @submit="reset.quiet(edits)"
            />

            <footer>
                <span>{{ t('FOOTER') }}&nbsp;</span>
                <a class="link" @click="click('auth-register')">{{ t('REGISTER') }}</a>
            </footer>

        </template>

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useForm, useAPI, isAuthPage, useAuthClick, useModal, useText, render, useMeta } from '#app/services/utils.js'
    const t = useText('route-auth-reset')

    const page = isAuthPage();
    const click = useAuthClick()
    const modal = useModal();
    const form = useForm('restore', { t });
    const reset = useAPI('auth-reset');

    const edits = reactive({
        email: ''
    })

    reset.onSuccess(() => {
        reset.success = true;
    })

    page.value && useMeta({
        title: t('META_TITLE'),
        description: t('META_DESCRIPTION')
    })

</script>