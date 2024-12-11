<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <header-icon icon="lg-bookmark" :to="{ name }" />
</template>


<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useUser } from '#app/services/utils'
    import HeaderIcon from './icon.vue'

    const user = useUser();
    const name = computed(() => user.role === 'candidate' ? 'account-favorite-jobs' : 'account-favorite-candidates')

</script>