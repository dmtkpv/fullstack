<!--
    Styles
-->

<style lang="scss">

    .WT8jwq {
        margin-bottom: $padding-y;
    }

</style>



<!--
    Template
-->

<template>
    <section>


        <!-- profile -->

        <article class="WT8jwq">

            <header class="heading">
                <h1 class="h3">{{ t('HEADING') }}</h1>
            </header>

            <l-form
                class="tile"
                :value="profile"
                :button="t('BUTTON_PROFILE')"
                :form="formProfile"
                :defaults="data.profile"
                :loading="saveProfile.pending"
                :error="saveProfile.error"
                @submit="saveProfile.quiet(profile)"
            />

        </article>


        <!-- password -->

        <article>

            <header class="heading">
                <h2 class="h4">{{ t('HEADING_PASSWORD') }}</h2>
            </header>

            <l-form
                class="tile"
                :value="password"
                :form="formPassword"
                :button="t('BUTTON_PASSWORD')"
                :loading="savePassword.pending"
                :error="savePassword.error"
                @submit="savePassword.quiet(password)"
            />

        </article>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { usePreload, useAPI, useUser, useForm, useText, empty, useMeta, useLists } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'genders',
            'education_levels',
            'education_fields',
            'languages',
        ],

        texts: [
            'i-image',
            'route-account-profile'
        ],

        preload ({ api, state }) {
            return {
                cvs: state.user.role === 'candidate' && api('account-cvs-list').fetch(),
                profile: api('account-profile-item').fetch()
            }
        }
    })



    // -------------------
    // Data
    // ------------------

    const t = useText('route-account-profile');
    const data = usePreload();
    const user = useUser();
    const lists = useLists();
    const profile = reactive({});
    const password = reactive({});
    const formProfile = useForm('profile', { t, user, data, lists });
    const formPassword = useForm('password', { t });
    const saveProfile = useAPI('account-profile-update');
    const savePassword = useAPI('account-profile-password');



    // -------------------
    // Hooks
    // -------------------

    saveProfile.onSuccess(() => {
        Object.assign(data.profile, profile);
        Object.keys(user).forEach(key => profile[key] && (user[key] = profile[key]))
        empty(profile);
    })

    savePassword.onSuccess(() => {
        empty(password);
    })

    useMeta();



</script>