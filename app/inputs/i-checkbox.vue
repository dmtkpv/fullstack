<!--
    Styles
-->

<style lang="scss">

    .i-checkbox {
        cursor: pointer;
    }

</style>



<!--
    Template
-->

<template>
    <div class="i-input box" @click="emit('update:modelValue', !modelValue)">
        <ui-switch :active="modelValue" />
        <span>{{ label }}</span>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    const emit = defineEmits([
        'update:modelValue'
    ])

    defineProps([
        'label',
        'modelValue',
        'disabled'
    ])
    
</script>