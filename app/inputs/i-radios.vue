<!--
    Styles
-->

<style lang="scss">

    .i-radios {
        .ui-switch {
            padding: 8px 0;
        }
    }

</style>



<!--
    Template
-->

<template>
    <div class="i-radios">
        <ui-switch
            v-for="item in list"
            type="radio"
            :key="item.value"
            :active="modelValue === item.value"
            :text="item.text"
            :total="item.value === modelValue ? undefined : item.total"
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
        'modelValue'
    ])

    function select (item) {
        let value;
        if (props.modelValue === item.value) value = undefined;
        else value = item.value;
        emit('update:modelValue', value);
    }

</script>