<!--
    Styles
-->

<style lang="scss">

    .i-text {

        border: $border;
        border-radius: $radius;
        background: $bg;
        padding: 16px;
        width: 100%;
        min-height: 240px;
        
        &:focus {
            border-color: $blue;
        }

        &::placeholder {
            opacity: .5;
        }

    }

</style>



<!--
    Template
-->

<template>
    <textarea
        class="i-text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value || null)"
    />
</template>



<!--
    Scripts
-->

<script setup>

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps([
        'modelValue',
        'placeholder'
    ])

</script>