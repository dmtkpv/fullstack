<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <m-default class="auth" :title="t('HEADING')">

        <l-form
            :button="t('BUTTON')"
            :value="data"
            :form="form"
            :error="error"
            :loading="login.pending"
            @submit="login.quiet('email', data)"
        />

        <footer>
            <span>{{ t('FOOTER') }}&nbsp;</span>
            <a class="link" @click="click('auth-register')">{{ t('REGISTER') }}</a>
        </footer>

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useForm, useAPI, useAuthClick, isAuthPage, useText, useModal, useMeta, useUser } from '#app/services/utils.js'



    // -------------------
    // Data
    // -------------------

    const t = useText('route-auth-login');
    const click = useAuthClick()
    const form = useForm('login', { t, restore: () => click('auth-reset') });
    const route = useRoute();
    const router = useRouter();
    const page = isAuthPage();
    const modal = useModal();
    const user = useUser();
    const login = useAPI('auth-login');
    const error = ref(null);

    const data = reactive({
        email: '',
        password: ''
    })



    // -------------------
    // Hooks
    // -------------------

    login.onSuccess(() => {
        if (page.value && route.query.from) return router.push(route.query.from);
        if (user.role === 'company' && !user.plan) return router.push({ name: 'account-plans' });
        if (user.role !== 'candidate') return router.push({ name: 'account-dashboard' });
        if (page.value) return router.push({ name: 'jobs' });
        else return router.push({ query: { ...route.query, t: Date.now() } });
    })

    login.onError(err => {
        if (err.code === 'UNVERIFIED') {
            if (page.value) router.push({ name: 'auth-verify', query: err.data });
            else modal.show('auth-verify', err.data);
        }
        else error.value = err;
    })

    page.value && useMeta({
        title: t('META_TITLE'),
        description: t('META_DESCRIPTION')
    })



</script>