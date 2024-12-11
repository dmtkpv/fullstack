<!--
    Styles
-->

<style lang="scss">



    // -------------------
    // Plans
    // -------------------

    .wlYIfr {
        padding-top: $gap;
    }



    // -------------------
    // Current plan
    // -------------------

    .sIwE8E {

        text-align: left;

        .ui-button {
            display: none;
        }

        ul:last-child {
            display: flex;
            flex-wrap: wrap;
            gap: 16px 48px;
            margin-top: 32px;
        }

    }



</style>



<!--
    Template
-->

<template>
    <section>


        <!-- heading -->

        <header class="heading">

            <h1 class="h3">{{ t('HEADING') }}</h1>

            <ui-button
                v-if="plan && !data.subscription?.manual"
                :text="t('BUTTON_EDIT')"
                :loading="stripe.pending"
                @click="stripe.quiet('update')"
            />

        </header>


        <!-- plans -->

        <l-plans
            class="wlYIfr"
            v-if="!plan || upgrade"
            v-model="annual"
            :value="data.plans"
            :subscription="data.subscription"
        />


        <!-- current plan -->

        <item-plan class="sIwE8E" v-else v-bind="plan">
            <ul class="ul-reset">
                <li>
                    <p class="h5">{{ t('LABEL_STATUS') }}</p>
                    <p>{{ t(`STATUS_${data.subscription.status.toUpperCase()}`) }}</p>
                </li>
                <li v-if="!data.subscription?.manual">
                    <p class="h5">{{ data.subscription.canceled ? t('LABEL_EXPIRES_AT') : t('LABEL_RENEWS_ON') }}</p>
                    <ui-date :value="data.subscription.expires_at" />
                </li>
            </ul>
        </item-plan>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAPI, usePreload, useText, useMeta } from '#app/services/utils.js'

    defineOptions({

        texts: [
            'l-plans',
            'item-plan',
            'route-account-plans'
        ],

        async preload ({ api, state }, to) {

            if (to.query.refresh) {
                const data = await api('stripe').fetch('refresh');
                state.user.plan = data.plan;
            }

            return {
                plans: api('content-plans').fetch(),
                subscription: api('account-subscription').fetch()
            }

        }

    })

    const t = useText('route-account-plans');
    const data = usePreload();
    const stripe = useAPI('stripe');
    const route = useRoute();
    const annual = ref(data.subscription?.annual ?? true);

    const upgrade = computed(() => {
        return route.query.upgrade;
    })

    const plan = computed(() => {
        if (!data.subscription || data.subscription.status === 'canceled') return false;
        const plan = data.plans.find(plan => plan.id === data.subscription.plan);
        const prices = [data.subscription];
        const annual = data.subscription.annual;
        return { annual, value: { ...plan, prices } };
    });

    stripe.onSuccess(data => {
        window.location.replace(data.url);
    })

    useMeta();



</script>