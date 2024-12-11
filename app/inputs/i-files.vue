<!--
    Styles
-->

<style lang="scss">

    .i-files {

        display: grid;
        grid-gap: 8px;

        @include lg-md {
            small { grid-column: 1 / 3 }
            grid-template-columns: 1fr 1fr;
        }

        .item-file {
            min-width: 0;
        }

    }

</style>


<!--
    Template
-->

<template>
    <div class="i-files">

        <small>{{ render(note, config) }}</small>

        <item-file
            v-for="(item, index) in list"
            v-bind="unit"
            :key="item.id"
            :value="item"
            @upload="onUpload(index, $event)"
            @delete="onRemove(index)" />

        <ui-upload
            v-if="list.length < config.max"
            :text="button"
            :extensions="config.extensions"
            multiple
            @input="add"
        />

    </div>
</template>


<!--
    Scripts
-->

<script setup>

    import { reactive, watch } from 'vue'
    import { useFiles, render } from '#app/services/utils.js'



    // -----------------
    // Data
    // -----------------

    const props = defineProps({
        type: {
            required: true,
            type: String
        },
        note: {
            required: true,
            type: String
        },
        button: {
            required: true,
            type: String
        },
        unit: {
            required: true,
            type: Object
        },
        list: {
            type: Array
        }
    })

    const list = reactive([]);
    const config = useFiles(props.type);



    // -----------------
    // Actions
    // -----------------

    function add (value) {
        const left = Math.max(config.max - list.length, 0);
        const files = [...value].slice(0, left);
        list.push(...files);
    }

    function onRemove (index) {
        list.splice(index, 1);
    }

    function onUpload (index, data) {
        list[index] = data;
    }



    // -----------------
    // Hooks
    // -----------------

    watch(() => props.list, value => {
        list.length = 0;
        value && list.push(...value);
    }, { immediate: true })



</script>