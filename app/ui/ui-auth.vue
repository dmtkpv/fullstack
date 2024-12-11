<!--
    Styles
-->

<style lang="scss">


</style>


<!--
    Template
-->

<template>
    <div v-show="visible" class="ui-auth" @click.capture="login">
        <slot />
    </div>
</template>


<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useUser, useModal } from '#app/services/utils.js'

    const props = defineProps({
        roles: {
            type: Array,
            default: []
        }
    })

    const user = useUser();
    const modal = useModal();

    const unlogged = computed(() => {
        return !user.role;
    })

    const visible = computed(() => {
        return unlogged.value || props.roles.includes(user.role)
    })

    function login (event) {
        if (!unlogged.value) return;
        event.stopPropagation()
        event.preventDefault()
        document.body.click(); // hide overlays
        modal.show('auth-login')
    }

</script>