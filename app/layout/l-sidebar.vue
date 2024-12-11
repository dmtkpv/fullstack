<!--
    Styles
-->

<style lang="scss">

    .l-sidebar {



        // --------------------
        // Common
        // --------------------

        position: fixed;
        inset: 0;
        top: $header;
        background: $translucent;



        // --------------------
        // Content
        // --------------------

        &_content {
            position: absolute;
            top: 0;
            height: 100%;
            overflow: auto;
            background: $white;
            padding: $padding-x;

            &._left { left: 0 }
            &._right { right: 0 }

        }

        &_close {
            width: max-content;
            margin-left: auto;
            margin-right: 0;
        }



        // --------------------
        // Animations
        // --------------------

        &.v-enter-active, &.v-leave-active {
            transition: background .3s ease;
        }

        &.v-enter-from, &.v-leave-to {
            background: rgba(0,0,0,0);
        }

        &.v-enter-active &_content, &.v-leave-active &_content,
        &_content.v-enter-active, &_content.v-leave-active {
            transition: transform .3s ease;
        }

        &.v-enter-from &_content._left, &.v-leave-to  &_content._left,
        &_content.v-enter-from._left, &_content.v-leave-to._left {
            transform: translateX(-100%);
        }

        &.v-enter-from &_content._right, &.v-leave-to  &_content._right,
        &_content.v-enter-from._right, &_content.v-leave-to._right {
            transform: translateX(100%);
        }



    }

</style>



<!--
    Template
-->

<template>
    <transition>
        <aside v-if="sidebar.active" class="l-sidebar" @click="outside">
            <transition>
                <div class="l-sidebar_content" v-bind="options.attrs" :class="type" :key="sidebar.name">

                    <a class="l-sidebar_close" v-if="options.close" @click="sidebar.hide()">
                        <ui-icon value="sm-close" type="md" />
                    </a>

                    <component :is="sidebar.component" />
                </div>
            </transition>
        </aside>
    </transition>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useOverlay } from '#app/services/utils.js'

    const sidebar = useOverlay('sidebar');
    const router = useRouter();

    const options = computed(() => {
        const { position, close, hideOn = 'fullPath', ...attrs } = sidebar.attrs ?? {};
        return { position, close, hideOn, attrs }
    })

    const type = computed(() => {
        return `_${options.value.position || 'left'}`
    })

    function outside ({ target, currentTarget }) {
        if (target === currentTarget) sidebar.hide();
    }

    router.beforeEach((curr, prev) => {
        const key = options.value.hideOn;
        if (curr[key] !== prev[key]) sidebar.hide();
    })

</script>