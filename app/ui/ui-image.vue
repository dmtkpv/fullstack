<!--
    Styles
-->

<style lang="scss">

    .ui-image {

        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        background: linear-gradient(90deg, rgba(9,165,190,.05) 40%, rgba(245,202,153,.05), rgba(9,165,190,.05) 60%) right / 300% 100%;
        animation: ui-image .75s linear infinite;

        &:before {
            content: '';
            display: block;
            padding-top: 100%;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: inherit;
            transition: opacity .3s;
        }

        &._square {
            border-radius: 16px;
        }

        &._circle {
            border-radius: 50%;
        }

        &._loading {
            img { opacity: 0 }
        }

        @keyframes ui-image {
            to { background-position: left }
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-image" :class="[`_${type}`, { _loading: loading }]">
        <img ref="$img" :src="src" @load="onLoad" @error="onError">
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, ref, watch, onMounted } from 'vue'

    const props = defineProps({
        uuid: {
            type: String,
        },
        width: {
            type: Number,
            default: 256
        },
        type: {
            type: String,
            default: 'circle',
            validator: value => ['circle', 'square'].includes(value)
        },
        default: {
            type: String,
            validator: value => ['user', 'company'].includes(value)
        }
    })

    const $img = ref(null);
    const error = ref(false);
    const loading = ref(false);

    const src = computed(() => {
        if (props.uuid && !error.value) return `${ADMIN_URL}/assets/${props.uuid}?width=${props.width}`
        if (props.default) return `/${props.default}.png`;
        return '/default.png';
    })

    function onLoad () {
        loading.value = false;
    }

    function onError () {
        error.value = true;
        loading.value = false;
    }

    watch(src, () => {
        error.value = false;
        loading.value = true;
    }, { immediate: true })


    onMounted(() => {
        if ($img.value.complete) loading.value = false;
    })

</script>