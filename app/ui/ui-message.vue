<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <ui-button v-bind="attrs" :loading="getPK.pending" @click="getPK.quiet(props)">
        <slot />
    </ui-button>
</template>



<!--
    Scripts
-->

<script setup>

    import { useAttrs } from 'vue'
    import { useRouter } from 'vue-router'
    import { useModal, useAPI } from '#app/services/utils.js'

    const props = defineProps({
        candidate: String,
        company: Number,
        job: Number
    })

    const api = {};
    const attrs = useAttrs();
    const modal = useModal();
    const router = useRouter();
    const getPK = useAPI('account-rooms-name');

    getPK.onSuccess(room => {
        if (room.id) router.push({ name: 'account-room', params: { id: room.id } });
        else modal.show('message', { room });
    })

</script>