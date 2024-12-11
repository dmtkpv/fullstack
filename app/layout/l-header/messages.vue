<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <header-icon
        icon="lg-message"
        :count="user.unread.messages"
        :to="{ name: 'account-rooms' }"
    />
</template>



<!--
    Scripts
-->

<script setup>

    import { useUser } from '#app/services/utils'
    import HeaderIcon from './icon.vue'

    const user = useUser();

</script>