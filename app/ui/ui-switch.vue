<!--
    Styles
-->

<style lang="scss">

    .ui-switch {

        display: flex;
        align-items: center;

        span {
            margin-left: 12px;
        }

        &._disabled {
            pointer-events: none;
            color: $grey;
        }

        &_icon {



            // -------------------
            // Common
            // -------------------

            position: relative;
            border: $border;
            height: 20px;
            border-radius: 10px;
            background: $white;
            transition: background .3s, border .3s;

            &:before {
                content: '';
                display: block;
                border-radius: 50%;
                background: $grey-light;
                transition: transform .3s, background .3s;
            }

            &._active {
                background: $blue;
                border-color: $blue;
            }

            &._active:before {
                background: $white;
            }



            // -------------------
            // Checkbox
            // -------------------

            &._checkbox {

                width: 40px;

                &:before {
                    width: 12px;
                    height: 12px;
                    margin: 3px;
                }

                &._active:before {
                    transform: translateX(20px);
                }

            }



            // -------------------
            // Radio
            // -------------------

            &._radio {

                width: 20px;
                transition: border .3s;

                &:before {
                    width: 8px;
                    height: 8px;
                    margin: 5px;
                }

            }


        }

    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="ui-switch" :class="{ _disabled: disabled }">
        <div class="ui-switch_icon" :class="[{ _active: active }, `_${type}`]" />
        <span v-if="text">{{ text }} <small v-if="total !== undefined">({{ total }})</small></span>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'

    const props = defineProps({
        active: Boolean,
        text: String,
        total: Number,
        disabled: Boolean,
        type: {
            default: 'checkbox',
            validator: value => ['radio', 'checkbox'].includes(value)
        }
    })

    const disabled = computed(() => {
        return props.disabled || props.total === 0;
    })

</script>