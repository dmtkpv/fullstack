<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <article class="container-md landing-plans" v-if="!user.id || user.role === 'company'">

        <landing-heading
            :title="t('HEADING')"
            :note="t('DESCRIPTION')"
        />

        <l-plans
            v-model="annual"
            :value="value"
            :subscription="subscription"
        />

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useText, useUser } from '#app/services/utils.js'

    const props = defineProps([
        'value',
        'subscription'
    ])

    const t = useText('landing-plans');
    const user = useUser();
    const annual = ref(props.subscription?.annual ?? true);

</script>