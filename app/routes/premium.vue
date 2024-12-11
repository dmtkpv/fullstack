<!--
    Styles
-->

<style lang="scss">

    .zKOThI {
        margin: 24px 0 48px 0;
    }

    .NzfhFw {
        display: flex;
        flex-wrap: wrap;
        gap: 24px
    }

</style>



<!--
    Template
-->

<template>
    <main class="landing">


        <!-- hero -->

        <landing-hero>

            <h1 class="h1" v-html="t('HEADING')" />
            <p class="zKOThI t4">{{ t('DESCRIPTION') }}</p>

            <div class="NzfhFw">
                <ui-button :text="t('REGISTER')" v-if="!user.id" @click="modal.show('auth-register', { type: 'company' })" />
                <ui-link :text="t('JOBS')" :to="{ name: 'jobs' }" />
            </div>

        </landing-hero>


        <!-- sections -->

        <landing-mobile />
        <landing-features :value="features" />
        <landing-stats />
        <landing-partners />
        <landing-desktop />
        <landing-plans :value="data.plans" :subscription="data.subscription"  />
        <landing-faq :value="data.faq" />
        <landing-contact />
        <landing-footer />


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { onMounted } from 'vue'
    import { useText, useCrisp, usePreload, useMeta, useUser, useModal } from '#app/services/utils.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'route-premium',
            'landing-mobile',
            'landing-stats',
            'landing-partners',
            'landing-desktop',
            'landing-plans',
            'landing-faq',
            'landing-contact',
            'landing-footer',
            'item-plan',
            'l-plans',
        ],

        preload ({ api, state }) {
            return {
                faq: api('content-faq').fetch(),
                plans: api('content-plans').fetch(),
                subscription: state.user.role === 'company' && api('account-subscription').fetch()
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-premium');
    const data = usePreload();
    const user = useUser();
    const crisp = useCrisp();
    const modal = useModal();

    const feature_1 = {
        image: '/landing/feature-1.png',
        title: t('FEATURE_1_HEADING'),
        note: t('FEATURE_1_DESCRIPTION'),
    }

    const feature_2 = {
        image: '/landing/feature-2.png',
        title: t('FEATURE_2_HEADING'),
        note: t('FEATURE_2_DESCRIPTION'),
    }

    const feature_3 = {
        image: '/landing/feature-3.png',
        title: t('FEATURE_3_HEADING'),
        note: t('FEATURE_3_DESCRIPTION'),
    }

    const features = {
        title: t('FEATURES_HEADING'),
        note: t('FEATURES_DESCRIPTION'),
        columns: [feature_1, feature_2, feature_3]
    }



    // -------------------
    // Hooks
    // -------------------

    useMeta();

    onMounted(async () => {
        crisp.show();
    })



</script>