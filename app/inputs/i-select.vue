<!--
    Styles
-->

<style lang="scss">

    .i-select {

        position: relative;

        &:not(._searchable) .i-input {
            cursor: pointer;
        }

        .ui-tooltip {
            width: 100%;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-select" :class="{ _searchable: searchable }">

        <i-input
            :icon="icon"
            :placeholder="placeholder"
            :readonly="!searchable"
            v-model="query"
            @input="input"
            @focusout="focusOut"
            @focusin="focusIn">

            <template #after>
                <ui-icon value="sm-down" />
            </template>

        </i-input>

        <ui-tooltip :model-value="tooltip" short v-if="results.length">
            <ui-item
                v-if="modelValue && clear"
                :text="clear"
                @click="select({ value: null })"
            />
            <ui-item
                v-for="item in results"
                :key="item.value"
                :text="item.text"
                :total="item.value === modelValue ? undefined : item.total"
                :active="item.value === modelValue"
                @click="select(item)"
            />
        </ui-tooltip>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, ref, watch } from 'vue'
    import { getListText } from '#app/services/utils.js'



    // -----------------
    // Config
    // -----------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: [Number, String, Boolean],
        searchable: Boolean,
        placeholder: String,
        icon: String,
        list: Array,
        clear: String
    })



    // -----------------
    // Data
    // -----------------

    const tooltip = ref(false);
    const edited = ref(false);
    const query = ref(null);

    const text = computed(() => {
        return getListText(props.list, props.modelValue);
    })

    const results = computed(() => {
        if (!props.searchable || !edited.value || !query.value) return props.list;
        const search = query.value.toLowerCase();
        return props.list.filter(item => {
            const alias = item.alias ? ` ${item.alias}` : '';
            const text = item.text + alias;
            return text.toLowerCase().includes(search)
        });
    })



    // -----------------
    // Handlers
    // -----------------

    function input () {
        edited.value = true;
        if (!query.value) emit('update:modelValue', null);
    }

    function focusIn ({ target }) {
        tooltip.value = true;
        setTimeout(() => target.selectionStart = target.selectionEnd = target.value.length)
    }

    function focusOut () {
        edited.value = false;
        tooltip.value = false;
        query.value = text.value ?? null;
    }

    function select ({ value }) {
        tooltip.value = false;
        emit('update:modelValue', value);
    }



    // -----------------
    // Hooks
    // -----------------

    watch(() => props.modelValue, () => {
        query.value = text.value ?? null;
    }, { immediate: true })



</script>