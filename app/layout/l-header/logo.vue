<!--
    Styles
-->

<style lang="scss">

    .l-header_logo {



        // --------------------
        // Common
        // --------------------

        $padding: 24px;
        $back: 98px + $padding;

        margin-right: auto;
        display: flex;
        align-items: center;
        transition: transform .3s;



        // --------------------
        // Button
        // --------------------

        .pGcGjh {

            transition: opacity .3s;

            @include lg-md {
                width: $back;
                padding-right: $padding;
                .ui-button { width: 100% }
            }

            @include sm {
                .ui-button { height: 40px }
            }

        }



        // --------------------
        // Image
        // --------------------

        .dZf0WS {

            svg {
                @include lg-md { height: 48px }
                @include sm { height: 40px }
            }

        }



        // --------------------
        // Without back button
        // --------------------

        &:not(._back) {

            @include lg-md {
                transform: translateX(-$back);
                .pGcGjh { opacity: 0; }
            }

            @include sm {
                .pGcGjh { display: none }
            }

        }



        // --------------------
        // Without back
        // --------------------

        &._back {

            @include lg-md {
                transform: translateX(0);
            }

            @include sm {
                .dZf0WS { display: none }
            }


        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="l-header_logo" :class="{ _back: state.back }">

        <div class="pGcGjh">
            <ui-button
                class="l-header_back t6"
                icon="lg-left"
                type="secondary"
                :to="state.back"
                :text="t('BACK')"
            />
        </div>

        <router-link class="dZf0WS" :to="{ name: 'home' }">
            <ui-icon value="il-logo" />
        </router-link>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useState, useText } from '#app/services/utils.js'

    const state = useState();
    const t = useText('l-header');

</script>