<!--
    Styles
-->

<style lang="scss">

    .i-checkboxes {
        .ui-switch {
            padding: 8px 0;
        }
    }

</style>



<!--
    Template
-->

<template>
    <div class="i-checkboxes">
        <ui-switch
            v-for="item in list"
            :key="item.value"
            :active="modelValue?.includes(item.value)"
            :text="item.text"
            @click="select(item)"
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

    const props = defineProps([
        'list',
        'modelValue' // undefined or []
    ])

    function select (item) {
        const data =  props.modelValue ? [...props.modelValue] : [];
        const index = data.indexOf(item.value);
        if (index < 0) data.push(item.value);
        else data.splice(index, 1);
        emit('update:modelValue', data);
    }

</script>