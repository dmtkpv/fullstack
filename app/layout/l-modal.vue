<!--
    Styles
-->

<style lang="scss">

    .l-modal {



        // --------------------
        // Common
        // --------------------

        position: fixed;
        inset: 0;
        background: $translucent;
        overflow: auto;






        // --------------------
        // Animations
        // --------------------

        &.v-enter-active, &.v-leave-active {
            transition: opacity .3s ease;
        }

        &.v-enter-from, &.v-leave-to {
            opacity: 0;
        }



    }

</style>



<!--
    Template
-->

<template>
    <transition>
        <aside v-if="modal.active" class="l-modal center" @click="outside">
            <component :is="modal.component" v-bind="modal.attrs" />
        </aside>
    </transition>
</template>



<!--
    Scripts
-->

<script setup>

    import { watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { useOverlay } from '#app/services/utils.js'

    const modal = useOverlay('modal');
    const route = useRoute();

    function outside ({ target, currentTarget }) {
        if (modal.noOutsideClick) return;
        if (target === currentTarget) modal.hide();
    }

    watch(route, () => {
        modal.hide();
    })

</script>