<!--
    Styles
-->

<style lang="scss">

    .ui-tabs {

        display: flex;
        padding: 8px;
        height: 56px;
        border-radius: 28px;

        button {
            padding: 0 24px;
            border-radius: 20px;
            &._active { @extend %blue }
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-tabs tile">
        <button
            v-for="tab in tabs"
            v-text="tab.text"
            :key="tab.value"
            :class="{ _active: tab.value === modelValue }"
            @click="emit('update:modelValue', tab.value)"
        />
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
        'tabs',
        'modelValue'
    ])

</script>