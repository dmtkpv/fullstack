<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <ui-button
        type="default"
        icon="lg-phone"
        :text="phone ? value : null"
        :href="phone ? `tel:${value}` : null"
        @click="phone = true"
    />
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'

    defineProps([
        'value'
    ])

    const phone = ref(false);

</script>