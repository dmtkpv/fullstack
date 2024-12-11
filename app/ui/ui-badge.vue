<!--
    Styles
-->

<style lang="scss">

    .ui-badge {
        display: flex;
        align-items: center;
        font-size: $t6;
        svg { margin-right: 4px }
    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-badge">
        <ui-icon type="md" :value="icon" />
        <span>{{ text }}</span>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    defineProps({
        icon: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    })

</script>