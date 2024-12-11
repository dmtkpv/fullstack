<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <main class="center">
        <router-view />
    </main>
</template>



<!--
    Script
-->

<script setup>

    defineOptions({
        preload ({ api, state }) {
            return state.user.id && api('auth-logout').quiet();
        }
    })

</script>