<!--
    Styles
-->

<style lang="scss">

    .l-header_icon {

        position: relative;

        span {
            position: absolute;
            top: -6px;
            left: 12px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="l-header_icon">
        <ui-icon :value="icon" />
        <span v-if="count" class="unread">{{ count }}</span>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    const props = defineProps([
        'count',
        'icon'
    ])

</script>