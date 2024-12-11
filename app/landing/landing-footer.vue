<!--
    Styles
-->

<style lang="scss">

    .landing-footer {

        svg {
            height: 48px;
            margin: 0 auto 16px auto;
        }

        nav {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            font-size: $t6;
            gap: 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <footer class="landing-footer container-md">

        <ui-icon value="il-logo" />

        <nav>
            <router-link v-if="user.id" :to="{ name: 'account-dashboard' }">{{ t('LINK_DASHBOARD') }}</router-link>
            <router-link v-else :to="{ name: 'auth-login' }">{{ t('LINK_LOGIN') }}</router-link>/
            <a :href="t('LINK_SUPPORT_URL')">{{ t('LINK_SUPPORT') }}</a>/
            <router-link :to="{ name: 'terms' }">{{ t('LINK_TERMS') }}</router-link>/
            <router-link :to="{ name: 'privacy' }">{{ t('LINK_PRIVACY') }}</router-link>
        </nav>

    </footer>
</template>



<!--
    Scripts
-->

<script setup>

    import { useUser, useText } from '#app/services/utils.js'
    const t = useText('landing-footer');
    const user = useUser();

</script>