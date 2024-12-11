<!--
    Styles
-->

<style lang="scss">

    .i-place {

        position: relative;

        .ui-tooltip {
            width: 100%;
        }

        &_clear {
            &:hover {
                color: $blue;
            }
        }

    }

</style>


<!--
    Template
-->

<template>
    <div class="i-place">


        <!-- input -->

        <i-input
            ref="input"
            type="text"
            icon="lg-location"
            :placeholder="placeholder"
            v-model="query"
            @focusout="tooltip = false"
            @focusin="tooltip = true">

            <template #after>
                <a v-if="query" @mousedown="clear" class="i-place_clear">
                    <ui-icon value="sm-close" />
                </a>
            </template>

        </i-input>


        <!-- tooltip -->

        <ui-tooltip :model-value="tooltip" v-if="items.length">
            <ui-item
                v-for="item in items"
                :key="item.value"
                :text="item.text"
                @click="select(item)"
            />
        </ui-tooltip>


    </div>
</template>


<!--
    Scripts
-->

<script setup>

    import { ref, watch } from 'vue'
    import { useSSR, useAPI } from '#app/services/utils'



    // -----------------
    // Data
    // -----------------

    const emit = defineEmits([
        'update:modelValue',
        'text'
    ])

    const props = defineProps([
        'text',
        'placeholder',
        'modelValue',
        'types'
    ])

    const search = useAPI('places-list');
    const ssr = useSSR();
    const query = ref('');
    const items = ref([]);
    const input = ref(null);
    const tooltip = ref(false);



    // -----------------
    // Handlers
    // -----------------

    function clear () {
        query.value = '';
        items.value = [];
        emit('update:modelValue', undefined);
    }

    function select ({ value, text }) {
        query.value = text;
        emit('update:modelValue', value);
        emit('text', text);
    }



    // -----------------
    // Hooks
    // -----------------

    search.onSuccess(data => {
        items.value = data;
    })

    watch(query, input => {
        search.cancel();
        !ssr && input && search.quiet({ input, types: props.types });
    })

    watch(() => props.text, value => {
        query.value = value;
    }, { immediate: true })



</script>