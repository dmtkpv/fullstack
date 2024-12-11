<!--
    Styles
-->

<style lang="scss">


    .ui-tooltip {



        // --------------------
        // Common
        // --------------------

        $arrow-size: 12px;
        $arrow-width: math.sqrt(2) * $arrow-size;
        $arrow-height: calc($arrow-width / 2);

        position: absolute;
        left: 0;
        margin: 8px 0;
        z-index: 1;



        // --------------------
        // Arrow
        // --------------------

        &_arrow {

            position: absolute;
            z-index: 1;
            left: 50%;
            width: $arrow-width;
            height: $arrow-height;
            overflow: hidden;

            &:before {
                content: '';
                position: absolute;
                left: 50%;
                width: $arrow-size;
                height: $arrow-size;
                background: $white;
                border-top: $border;
                border-left: $border;
                transform-origin: 0 0;
                transform: rotate(45deg);
            }

        }



        // --------------------
        // Content
        // --------------------

        &_content {
            overflow: auto;
            background: $white;
            box-shadow: $shadow;
            border: $border;
            border-radius: $radius;
            padding: 12px;

            &._short {
                max-height: 250px;
            }

        }



        // --------------------
        // Modifiers
        // --------------------

        &:not(._above) {
            top: 100%;
        }

        &:not(._above) &_arrow {
            top: 0;
            transform: translate(-50%, 1 - $arrow-height);
        }

        &._above {
            bottom: 100%;
        }

        &._above &_arrow {
            bottom: 0;
            transform: translate(-50%, $arrow-height - 1) rotate(180deg) ;
        }



    }

</style>



<!--
    Template
-->

<template>
    <div ref="$el" class="ui-tooltip" v-show="modelValue">
        <div class="ui-tooltip_arrow" />
        <div class="ui-tooltip_content" :class="{ _short: short }" v-bind="attrs">
            <slot />
        </div>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, watch, onMounted, onUnmounted, nextTick, useAttrs } from 'vue'
    import { useRoute } from 'vue-router'
    import { getProp } from '#app/services/utils.js'



    // -------------------
    // Data
    // -------------------

    defineOptions({
        inheritAttrs: false
    })

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: Boolean,
        short: Boolean,
        above: Boolean
    })

    const MARGIN = 8;
    const route = useRoute();
    const attrs = useAttrs();
    const $el = ref(null);



    // -------------------
    // Helpers
    // -------------------

    function isParent (parent, target) {
        if (!target) return false;
        if (target === $el.value) return false;
        if (target === parent) return true;
        return isParent(parent, target?.parentNode);
    }

    function isAbove (source, target) {
        const header = getProp('--header');
        const above = target.top - header;
        const below = window.innerHeight - target.bottom;
        if (source.height > below) return above > below;
        else return false;
    }



    // -------------------
    // Handlers
    // -------------------

    function style () {
        if (!props.modelValue) return;
        const $source = $el.value;
        const $target = $source.parentNode;
        const [$arrow] = $source.children;
        $source.style.marginLeft = '';
        const source = $source.getBoundingClientRect();
        const target = $target.getBoundingClientRect();
        const above = props.above || isAbove(source, target);
        const center = (target.width - source.width) / 2;
        const offset = Math.max(source.right + center - window.innerWidth + 8, 0); // 8 - margin right
        $source.style.marginLeft = center - offset + 'px'
        $source.classList.toggle('_above', above);
        $arrow.style.marginLeft = offset + 'px'
    }

    function outside ({ target }) {
        if (!props.modelValue) return;
        if (isParent($el.value.parentNode, target)) return;
        emit('update:modelValue', false);
    }



    // -------------------
    // Hooks
    // -------------------

    onMounted(() => {
        window.addEventListener('resize', style);
        window.addEventListener('scroll', style);
        document.addEventListener('click', outside);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', style);
        window.removeEventListener('scroll', style);
        document.removeEventListener('click', outside);
    })

    watch(() => props.modelValue, () => {
        nextTick(style);
    })

    watch(route, () => {
        emit('update:modelValue', false);
    })



</script>