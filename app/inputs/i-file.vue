<!--
    Styles
-->

<style lang="scss">

    .i-file {

        position: relative;

        small {
            display: block;
            margin-bottom: 8px;
        }

        .i-input {
            cursor: pointer;
        }

        .ui-tooltip {
            width: 100%;
        }

        .ui-spinner {
            height: 24px;
        }

        .ui-error {
            margin-top: 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-file">


        <!-- input -->

        <i-input
            v-if="list.length"
            :readonly="true"
            :placeholder="placeholder"
            :model-value="text"
            :disabled="upload.pending"
            @focusout="tooltip = false"
            @focusin="tooltip = true">

            <template #after>
                <ui-spinner v-if="upload.pending" />
                <ui-icon v-else value="sm-down" />
            </template>

        </i-input>


        <!-- tooltip -->

        <ui-tooltip v-if="list.length" :model-value="tooltip">

            <ui-item
                v-for="item in list"
                :key="item.id"
                :text="item.filename_download"
                :active="item.id === modelValue"
                @click="select(item)"
            />

            <ui-upload
                v-if="list.length < config.max"
                :text="button"
                :extensions="config.extensions"
                @mousedown.prevent
                @click="click"
                @input="add"
            />

        </ui-tooltip>


        <!-- nil -->

        <template v-else>

            <small>{{ render(note, config) }}</small>

            <ui-upload
                v-if="list.length < config.max"
                :text="button"
                :extensions="config.extensions"
                @input="add"
            />

        </template>


        <!-- error -->

        <ui-error
            v-if="upload.error"
            :value="upload.error"
        />


    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive, computed, watch } from 'vue'
    import { render, useAPI, useFiles } from '#app/services/utils.js'



    // -----------------
    // Config
    // -----------------

    const emit = defineEmits([
        'update:modelValue'
    ])

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
        uploadApi: {
            required: true,
            type: String
        },
        list: Array,
        placeholder: String,
        modelValue: String
    })



    // -----------------
    // Data
    // -----------------

    const config = useFiles(props.type);
    const upload = useAPI(props.uploadApi);
    const list = reactive([]);
    const tooltip = ref(false);

    const text = computed(() => {
        return list.find(item => item.id === props.modelValue)?.filename_download;
    })



    // -----------------
    // Actions
    // -----------------

    function click () {
        document.activeElement?.blur();
    }

    function select ({ id }) {
        emit('update:modelValue', id)
    }

    function add ([file]) {
        upload.quiet(file);
    }



    // -----------------
    // Hooks
    // -----------------

    upload.onSuccess(data => {
        list.push(data);
        emit('update:modelValue', data.id)
    })

    watch(() => props.list, value => {
        list.length = 0;
        value && list.push(...value);
    }, { immediate: true })



</script>