<!--
    Styles
-->

<style lang="scss">

    .l-sidebar { z-index: 1 }
    .l-header { z-index: 2 }
    .l-modal { z-index: 4 }
    .l-loader { z-index: 3 }

</style>



<!--
    Template
-->

<template>
    <l-header />
    <l-loader />
    <l-error v-if="state.error" :value="state.error" />
    <router-view v-else />
    <l-sidebar />
    <l-modal />
</template>



<!--
    Scripts
-->

<script setup>

    import { watch, computed } from 'vue'
    import { useState, useOverlay } from '#app/services/utils.js'

    const modal = useOverlay('modal');
    const sidebar = useOverlay('sidebar');
    const state = useState();

    const scrollable = computed(() => {
        return !modal.active && !sidebar.active
    })

    watch(scrollable, value => {
        document.body.style.overflow = value ? '' : 'hidden'
    })

</script>