<!--
    Styles
-->

<style lang="scss">

    .item-plan {



        // -------------------
        // Common
        // -------------------

        display: flex;
        flex-direction: column;
        text-align: center;

        .h4 {
            margin-bottom: 8px;
        }

        .ui-button {
            width: 100%;
            margin-bottom: 32px;
        }

        @include lg {
            padding: 32px;
        }

        @include md-sm {
            padding: 24px;
        }



        // -------------------
        // Price
        // -------------------

        &_price {
            margin-bottom: 32px;
            span:first-child {
                vertical-align: top;
                margin-right: 4px;
            }
        }


        &_title {
            margin-bottom: 32px;
        }



        // -------------------
        // Icon
        // -------------------

        &_icon {
            flex-shrink: 0;
            padding: 6px;
            margin-right: 8px;
            border-radius: 50%;
            @extend %blue-light;
        }



        // -------------------
        // Features
        // -------------------

        &_features {

            li {
                display: flex;
                align-items: flex-start;
                text-align: left;
                margin-bottom: 12px;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <div class="item-plan tile">


        <!-- price -->

        <div class="item-plan_price" v-if="amount">
            <span class="h6">€</span>
            <span class="h2">{{ amount }}</span>
            <p class="t6">{{ t('NOTE') }}</p>
        </div>


        <!-- title -->

        <div class="item-plan_title">
            <h3 class="h4">{{ value.title }}</h3>
            <p>{{ value.description }}</p>
        </div>


        <!-- button -->

        <ui-button
            class="item-plan_margin"
            v-if="button"
            :text="button"
            :loading="stripe.pending"
            :disabled="disabled"
            @click="select"
        />


        <!-- features -->

        <ul class="ul-reset item-plan_features">
            <li v-for="feature in value.features">
                <div class="item-plan_icon">
                    <ui-icon value="sm-check" />
                </div>
                <p>{{ feature.title }}</p>
            </li>
        </ul>


        <!-- slot -->

        <slot />


    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAPI, useUser, useText, useModal } from '#app/services/utils.js'



    // --------------------
    // Data
    // --------------------

    const props = defineProps({
        value: Object,
        annual: Boolean,
        subscription: [Boolean, Object] // false or {}
    })

    const t = useText('item-plan')
    const user = useUser();
    const route = useRoute();
    const router = useRouter();
    const modal = useModal();
    const stripe = useAPI('stripe');



    // --------------------
    // Computed
    // --------------------

    const price = computed(() => {
        return props.value.prices.find(price => price.annual === props.annual);
    })

    const premium = computed(() => {
        return props.subscription && props.subscription.status !== 'canceled';
    })

    const button = computed(() => {
        if (!props.subscription) return t('BUTTON_TRIAL');
        if (props.subscription.manual) return false;
        if (props.subscription.price.startsWith('plan_')) return false;
        if (props.subscription.status === 'canceled') return t('BUTTON_SUBSCRIBE');
        if (props.subscription.price === price.value.id) return t('BUTTON_CURRENT');
        return t('BUTTON_UPDATE');
    })

    const disabled = computed(() => {
        return premium.value && props.subscription.price === price.value.id;
    })

    const amount = computed(() => {
        return price.value.amount?.toFixed(2).replace('.', ',').replace(',00', '')
    })



    // --------------------
    // Actions
    // --------------------

    function select () {
        if (!user.id) return modal.show('auth-register', { type: 'company' });
        if (premium.value) stripe.quiet('update', { price_id: price.value.id });
        else stripe.quiet('create', { price_id: price.value.id, cancel_route: route.name });
    }



    // --------------------
    // Hooks
    // --------------------

    stripe.onSuccess(data => {
        window.location.replace(data.url);
    })



</script>