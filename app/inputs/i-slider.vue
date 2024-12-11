<!--
    Styles
-->

<style lang="scss">

    .i-slider {

        padding: 8px 0;
        position: relative;

        &_scroll {
            position: relative;
            height: 6px;
            border-radius: 3px;
            background: $bg;
            border: $border;
        }

        &_track {
            position: absolute;
            height: 100%;
            background: $blue;
            width: 0;
            pointer-events: none;
        }

        &_drag {
            position: absolute;
            top: 50%;
            left: 0;
            width: 20px;
            height: 20px;
            background: $white;
            border: 2px solid $blue;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }

        &_value {
            position: absolute;
            right: 0;
            bottom: 100%;
            margin-bottom: 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-slider">

        <div class="i-slider_scroll" ref="$scroll">
            <div class="i-slider_track" ref="$track" :style="{ width: ratio * 100 + '%' }" />
            <a class="i-slider_drag" ref="$drag" :style="{ left: ratio * 100 + '%' }" />
        </div>

        <div class="i-slider_value">
            {{ value ? `${value}km` : t('ANY') }}
        </div>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
    import { useText } from '#app/services/utils.js'



    // -----------------
    // Data
    // -----------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: Number,
        max: { type: Number, required: true },
        min: { type: Number, required: true },
    })

    const t = useText('i-slider');
    const drag = {}
    const ratio = ref(0)
    const $scroll = ref(null);
    const $track = ref(null);
    const $drag = ref(null);

    const value = computed(() => {
        const value = Math.round(props.min + (props.max - props.min) * ratio.value);
        return value === props.max ? undefined : value;
    })



    // -----------------
    // Helpers
    // -----------------

    function output () {
        emit('update:modelValue', value.value);
    }

    function update (ratio) {
        $track.value.style.width = ratio * 100 + '%';
        $drag.value.style.left = ratio * 100 + '%'
    }

    function clientX (event) {
        return event.touches?.[0] ? event.touches[0].clientX : event.clientX;
    }



    // -----------------
    // Handlers
    // -----------------

    function start (event) {
        drag.active = true;
        drag.start = clientX(event);
        drag.origin = $drag.value.offsetLeft / $scroll.value.offsetWidth;
        event.preventDefault();
    }

    function move (event) {
        if (!drag.active) return;
        ratio.value = drag.origin + (clientX(event) - drag.start) / $scroll.value.offsetWidth;
        ratio.value = Math.max(ratio.value, 0);
        ratio.value = Math.min(ratio.value, 1);
        event.preventDefault();
    }

    function end () {
        if (!drag.active) return;
        drag.active = false;
        output();
    }

    function click (event) {
        if (event.target !== event.currentTarget) return;
        const { left, width } = $scroll.value.getBoundingClientRect();
        ratio.value = (clientX(event) - left) / width;
        output();
    }



    // -----------------
    // Hooks
    // -----------------

    onMounted(() => {
        $scroll.value.addEventListener('click', click);
        $drag.value.addEventListener('mousedown', start);
        $drag.value.addEventListener('touchstart', start);
        document.addEventListener('mousemove', move);
        document.addEventListener('touchmove', move);
        document.addEventListener('mouseup', end);
        document.addEventListener('touchend', end);
        document.addEventListener('mouseleave', end);
        document.addEventListener('touchcancel', end);
    })

    onUnmounted(() => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('touchmove', move);
        document.removeEventListener('mouseup', end);
        document.removeEventListener('touchend', end);
        document.removeEventListener('mouseleave', end);
        document.removeEventListener('touchcancel', end);
    })

    watch(() => props.modelValue, value => {
        ratio.value = value == null ? 1 : (value - props.min) / (props.max - props.min);
    }, { immediate: true })



</script>