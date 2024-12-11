<!--
    Styles
-->

<style lang="scss">

    .ui-tag {

        display: inline-flex;
        align-items: center;
        line-height: 24px;
        border-radius: 12px;
        padding: 0 12px;

        svg {
            margin-right: 4px;
        }

        &._grey { @extend %grey }

        &._blue { @extend %blue }
        &._blue-light { @extend %blue-light }
        &._blue-dark { @extend %blue-dark }

        &._red { @extend %red }
        &._red-light { @extend %red-light }
        &._red-dark { @extend %red-dark }

        &._yellow { @extend %yellow }
        &._yellow-light { @extend %yellow-light }
        &._yellow-dark { @extend %yellow-dark }

        &._green { @extend %green }
        &._green-light { @extend %green-light }
        &._green-dark { @extend %green-dark }

    }

</style>



<!--
    Template
-->

<template>
    <small class="ui-tag" :class="`_${type}`">
        <ui-icon v-if="icon" :value="icon" />
        <span>{{ text }}</span>
    </small>
</template>



<!--
    Scripts
-->

<script setup>

    const props = defineProps({
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'yellow',
            validator: value => [
                'grey',
                'blue',
                'blue-light',
                'blue-dark',
                'red',
                'red-light',
                'red-dark',
                'yellow',
                'yellow-light',
                'yellow-dark',
                'green',
                'green-light',
                'green-dark'
            ].includes(value),
        },
        icon: {
            type: String,
        }
    })


</script>