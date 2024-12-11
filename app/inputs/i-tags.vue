<!--
    Styles
-->

<style lang="scss">

    .i-tags {

        position: relative;

        .i-input {
            flex-wrap: wrap;
            input {
                width: 128px;
                flex-grow: 1;
            }
        }

        &_tag {
            background: $grey-light;
            padding: 0 10px;
            height: 30px;
            font-size: $t6;
            border-radius: $radius;
            white-space: nowrap;
            display: flex;
            align-items: center;
            svg {
                cursor: pointer;
                margin-left: 4px;
                &:hover { color: $black }
            }
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
    <div class="i-tags">

        <i-input
            v-model="query"
            :placeholder="placeholder"
            @focusout="tooltip = false"
            @focusin="tooltip = true">
            <template #before>
                <div class="i-tags_tag" v-for="id in modelValue">
                    <span>{{ getListText(list, id) }}</span>
                    <ui-icon @click="del(id)" value="sm-close" />
                </div>
            </template>
        </i-input>

        <ui-tooltip :model-value="tooltip" short v-if="items.length">
            <ui-item
                v-for="item in items"
                :key="item.value"
                :text="item.text"
                :active="item.value === modelValue"
                @click="add(item.value)"
            />
        </ui-tooltip>

    </div>
</template>


<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { getListText } from '#app/services/utils.js'


    // -----------------
    // Config
    // -----------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps([
        'modelValue',
        'list',
        'placeholder'
    ])

    const tooltip = ref(false);
    const query = ref(null);

    const items = computed(() => {
        const search = query.value ? query.value.toLowerCase() : '';
        const active = props.modelValue || [];
        return props.list.filter(item => {
            if (active.includes(item.value)) return;
            const alias = item.alias ? ` ${item.alias}` : '';
            const text = item.text + alias;
            return text.toLowerCase().includes(search);
        });
    })

    function add (id) {
        const data =  props.modelValue ? [...props.modelValue] : [];
        emit('update:modelValue', [...data, id]);
        query.value = null;
    }

    function del (id) {
        const data =  props.modelValue ? [...props.modelValue] : [];
        const index = data.indexOf(id);
        data.splice(index, 1);
        emit('update:modelValue', data);
    }

</script>