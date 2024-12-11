<!--
    Styles
-->

<style lang="scss">

    .l-table {



        // -----------------
        // Common
        // -----------------

        @mixin tile {
            background: $white;
            border-radius: $radius;
            box-shadow: $shadow;
        }



        // -----------------
        // Desktop
        // -----------------

        @include lg-md {

            display: table;
            width: 100%;
            padding: 0 $gap-lg;
            @include tile;

            &_tr {
                display: table-row;
            }

            &_td, &_th {
                display: table-cell;
                vertical-align: middle;
                padding: 16px;
                &:first-child { padding-left: 0 }
                &:last-child { padding-right: 0 }
            }

            &_th {
                font-weight: 500;
                font-size: $t7;
                text-transform: uppercase;
                color: $black;
            }

            &_td {
                cursor: pointer;
                border-top: $border;
            }

            .ui-actions {
                float: right;
            }


        }



        // -----------------
        // Mobile
        // -----------------

        @include sm {

            &_tr {
                @include tile;
                position: relative;
                margin-bottom: 16px;
                padding: 16px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                &:first-child { display: none }
            }

            &_td:first-child {
                flex: 0 0 100%;
                padding: 0 40px 8px 0;
            }

            &_td._actions {
                position: absolute;
                top: 16px;
                right: 16px;
            }

        }


        
    }

</style>



<!--
    Template
-->

<template>
    <div class="l-table">


        <!-- th -->

        <div class="l-table_tr">
            <div class="l-table_th" v-for="column in columns">{{ column.label }}</div>
            <div class="l-table_th" v-if="actions" />
        </div>


        <!-- td -->

        <div class="l-table_tr" v-for="row in data" :key="row[pk]" :class="{ _disabled: row._disabled }" @click="click($event, row)">

            <div class="l-table_td" v-for="column in columns">
                <component :is="column.component" :value="column.key ? row[column.key] : row" v-bind="column.options" />
            </div>

            <div class="l-table_td _actions" v-if="actions">
                <ui-actions :value="actions(row)" @action="action($event, row)" />
            </div>

        </div>


    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useAttrEmit, useModal } from '#app/services/utils.js'

    const emit = defineEmits([
        'click'
    ])

    const props = defineProps({
        columns: Array,
        actions: Function,
        data: Array,
        pk: {
            type: String,
            default: 'id'
        }
    })

    const modal = useModal();
    const emitAttr = useAttrEmit();

    function isClickable (node, el) {
        if (node.classList.contains('ui-actions')) return true;
        if (node === el) return;
        return isClickable(node.parentNode, el);
    }

    function click (event, row) {
        const clickable = isClickable(event.target, event.currentTarget);
        if (!clickable) emit('click', row);
    }

    function action (name, row) {
        const onSuccess = () => emitAttr(name, row);
        if (name === 'delete') modal.show('confirm', { onSuccess })
        else onSuccess();
    }

</script>