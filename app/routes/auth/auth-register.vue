<!--
    Styles
-->

<style lang="scss">

    .dYVHUL {

        display: grid;
        grid-gap: 24px;
        margin-bottom: 24px;

        a {

            border-radius: $radius;
            border: $border;
            padding: 8px 16px 12px 16px;

            .ui-switch {
                font-weight: $w6;
                color: $black;
                margin-bottom: 4px;
            }

            &._active {
                border-color: $blue;
            }

        }

        @include lg-md {
            grid-template-columns: 1fr 1fr;
        }

        @include sm {
            grid-template-columns: 1fr;
        }


    }

</style>



<!--
    Template
-->

<template>
    <m-default class="auth" :title="user.role ? tabs[user.role].heading : t('HEADING')">


        <!-- form -->

        <l-form
            v-if="user.role"
            :button="t('BUTTON')"
            :value="user"
            :form="form"
            :disabled="register.pending"
            :error="register.error"
            @submit="submit"
        />


        <!-- role -->

        <template v-else>

            <div class="dYVHUL">
                <a v-for="({ title, note }, key) in tabs" :class="{ _active: key === tab }" @click="tab = key">
                    <ui-switch type="radio" :text="title" :active="key === tab" />
                    <p class="t6">{{ note }}</p>
                </a>
            </div>

            <ui-button :text="`${t('JOIN')} ${tabs[tab].title}`" @click="user.role = tab" />

        </template>


        <!-- footer -->

        <footer>
            <span>{{ t('FOOTER') }}&nbsp;</span>
            <a class="link" @click="click('auth-login')">{{ t('LOGIN') }}</a>
        </footer>


    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useForm, useAPI, useAuthClick, useModal, useText, useMeta, isAuthPage } from '#app/services/utils'
    const t = useText('route-auth-register');



    // -------------------
    // Config
    // -------------------

    const props = defineProps({
        type: {
            type: String,
            validator: value => ROLES.includes(value),
        }
    })

    const tabs = {
        candidate: {
            heading: t('TAB_CANDIDATE_HEADING'),
            title: t('TAB_CANDIDATE_TITLE'),
            note: t('TAB_CANDIDATE_DESCRIPTION')
        },
        company: {
            heading: t('TAB_COMPANY_HEADING'),
            title: t('TAB_COMPANY_TITLE'),
            note: t('TAB_COMPANY_DESCRIPTION')
        }
    }

    const user = reactive({
        role: props.type,
        company: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    })



    // -------------------
    // Data
    // -------------------

    const tab = ref(props.type || 'candidate');
    const click = useAuthClick()
    const form = useForm('register', { user, t });
    const register = useAPI('auth-register');
    const router = useRouter();
    const route = useRoute();
    const modal = useModal();
    const page = isAuthPage();

    if (page.value && ROLES.includes(route.query.role)) {
        user.role = route.query.role;
    }



    // -------------------
    // Actions
    // -------------------

    function submit () {
        const body = { ...user };
        if (body.role === 'candidate') delete body.company;
        register.quiet(body);
    }



    // -------------------
    // Hooks
    // -------------------

    register.onSuccess(data => {
        if (page.value) router.push({ name: 'auth-verify', query: data });
        else modal.show('auth-verify', data);
    })

    page.value && useMeta({
        title: t('META_TITLE'),
        description: t('META_DESCRIPTION')
    })



</script>



<!--
    Options
-->

<script>

    const ROLES = [
        'candidate',
        'company'
    ]

</script>