<!--
    Styles
-->

<style lang="scss">

    .m-images {

        height: 100%;

        &_close {
            position: fixed;
            top: 0;
            right: 0;
            background: $white;
            padding: 8px;
            border-radius: 0 0 0 4px;
        }

        &_slide {

            display: flex;
            width: 100%;
            height: 100%;

            img {
                max-width: 100%;
                max-height: 100%;
                margin: auto;
                user-select: none;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <div class="m-images">
        <a class="m-images_close">
            <ui-icon value="sm-close" type="md" />
        </a>
        <div class="m-images_slide" v-for="(image, i) in images" v-image="image" v-show="i === index" />
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, onMounted, onUnmounted } from 'vue'
    import { useModal } from '#app/services/utils.js'

    const props = defineProps([
        'index',
        'images'
    ])

    const vImage = {
        mounted (el, bindings) {
            bindings.value.draggable = false;
            el.appendChild(bindings.value);
        }
    }

    const index = ref(props.index);
    const modal = useModal();
    let startX = false;
    let target;

    function setIndex (delta) {
        index.value += delta;
        if (index.value < 0) index.value = props.images.length - 1;
        if (index.value > props.images.length - 1) index.value = 0;
    }

    function getX (event) {
        return (event.touches?.[0] ?? event).clientX;
    }

    function start (event) {
        target = event.target;
        if (event.target.tagName !== 'IMG') return;
        startX = getX(event);
    }

    function move (event) {
        if (startX === false) return;
        const x = getX(event);
        if (Math.abs(x - startX) < 50) return;
        setIndex(x > startX ? 1 : -1);
        startX = false;
    }

    function end (event) {
        startX = false;
        if (event.target === target && target.tagName !== 'IMG') modal.hide();
    }

    function key (event) {
        if (event.keyCode === 37) setIndex(-1);
        if (event.keyCode === 39) setIndex(1);
        if (event.keyCode === 27) modal.hide();
    }

    onMounted(() => {
        document.addEventListener('keydown', key);
        document.addEventListener('mousedown', start);
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        document.addEventListener('touchstart', start);
        document.addEventListener('touchmove', move);
        document.addEventListener('touchend', end);
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', key);
        document.removeEventListener('mousedown', start);
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
        document.removeEventListener('touchstart', start);
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
    })

</script>