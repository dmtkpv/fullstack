<!--
    Styles
-->

<style lang="scss">

    .l-plans {



        // -------------------
        // Switch
        // -------------------

        &_switch {

            position: relative;
            width: max-content;
            margin: 0 auto 32px auto;

            .ui-icon {
                width: 48px;
                position: absolute;
                bottom: 100%;
                right: 24px;
                margin-bottom: 8px;
                stroke: currentColor;
                @include sm {
                    transform: scale(-1, 1);
                }
            }

            .ui-tag {
                position: absolute;
                bottom: 100%;
                margin-bottom: 4px;
                white-space: nowrap;
                @include lg-md {
                    left: calc(100% - 48px);
                }
                @include sm {
                    right: 48px;
                }
            }

        }



        // -------------------
        // List
        // -------------------

        &_list {

            display: grid;

            @include lg-md {
                gap: 32px;
                grid-template-columns: repeat(3, 1fr);
            }

            @include md-sm {
                gap: 24px;
            }

        }


    }

</style>



<!--
    Template
-->

<template>
    <div class="l-plans">

        <div class="l-plans_switch">
            <ui-icon value="il-arrow" />
            <ui-tag class="w6" :text="t('TAG')" type="green-dark" />
            <ui-tabs :tabs="tabs" v-model="annual" />
        </div>

        <div class="l-plans_list">
            <item-plan
                v-for="plan in value"
                :key="plan.id"
                :value="plan"
                :annual="annual"
                :subscription="subscription"
            />
        </div>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useText } from '#app/services/utils.js'

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps([
        'modelValue',
        'value',
        'subscription'
    ])

    const t = useText('l-plans');

    const tabs = [
        { text: t('MONTHLY'), value: false },
        { text: t('ANNUALLY'), value: true },
    ]

    const annual = computed({
        get: () => props.modelValue,
        set: value => emit('update:modelValue', value)
    })

    const plans = computed(() => {
        return props.value.filter(plan => plan.annual === props.modelValue);
    })

</script>