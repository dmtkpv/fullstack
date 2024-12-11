<!--
    Styles
-->

<style lang="scss">

    .ui-item {

        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: calc($radius / 2);
        margin: 4px 0;
        width: 100%;

        svg:first-child {
            margin-right: 12px;
        }

        span {
            flex-grow: 1;
        }

        &:hover {
            background: $bg;
            color: $blue;
        }

        &._active,
        &.router-link-exact-active {
            background: $bg;
            color: $blue;
            pointer-events: none;
        }

        &._disabled {
            pointer-events: none;
            color: $grey;
        }

    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic
        class="ui-item"
        :class="{ _active: active, _disabled: disabled }"
        @mousedown.prevent
        @click="click">

        <ui-icon v-if="icon" :value="icon" />
        <span>{{ text }} <small v-if="total !== undefined">({{ total }})</small></span>


    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'

    const emit = defineEmits([
        'click'
    ])

    const props = defineProps({
        text: String,
        icon: String,
        total: Number,
        active: Boolean,
        disabled: Boolean
    })

    const disabled = computed(() => {
        return props.disabled || props.total === 0;
    })

    function click (event) {
        document.activeElement?.blur();
        emit('click', event);
    }

</script>