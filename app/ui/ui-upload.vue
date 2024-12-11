<!--
    Styles
-->

<style lang="scss">

    .ui-upload {

        border: $border;
        cursor: pointer;

        svg {
            height: 30px;
        }

        span {
            color: $blue;
        }

        input {
            display: none;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-upload box" @click="$input.click()">
        <ui-icon value="lg-upload" type="custom" />
        <span class="cut">{{ text }}</span>
        <input ref="$input" type="file" :accept="accept" :multiple="multiple" @change="select">
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'

    const emit = defineEmits([
        'input'
    ])

    const props = defineProps({
        text: {
            type: String,
            required: true
        },
        extensions: {
            type: Array,
            required: true
        },
        multiple: Boolean
    })

    const $input = ref(null);

    const accept = computed(() => {
        return props.extensions.map(ext => '.' + ext).join(',')
    })

    function select (event) {
        emit('input', event.target.files);
        $input.value.value = '';
    }

</script>