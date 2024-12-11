<!--
    Styles
-->

<style lang="scss">

    .l-header_auth {

        display: flex;
        gap: 16px;

        @include lg-md {
            .l-header_icon { display: none }
        }

        @include sm {
            .ui-button, .link { display: none }
        }

    }

</style>



<!--
    Template
-->

<template>

    <div class="l-header_auth t6">

        <header-icon
            icon="lg-user"
            @click="click('auth-login')"
        />

        <button class="link w6" @click="click('auth-register')">
            {{ t('REGISTER') }}
        </button>

        <ui-button
            :text="t('LOGIN')"
            type="secondary"
            @click="click('auth-login')"
        />

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useAuthClick, useText } from '#app/services/utils.js'
    import HeaderIcon from './icon.vue'

    const t = useText('l-header');
    const click = useAuthClick();

</script>