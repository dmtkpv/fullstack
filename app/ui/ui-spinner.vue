<!--
    Styles
-->

<style lang="scss">

    .ui-spinner {

        animation: ui-spinner 1s linear infinite;
        border-radius: 50%;
        overflow: hidden;

        path, circle {
            fill: none;
            stroke: currentColor;
            stroke-width: 8px;
            vector-effect: non-scaling-stroke;
        }

        circle {
            opacity: .25;
        }

        @keyframes ui-spinner {
            to { transform: rotate(360deg) }
        }

    }

</style>



<!--
    Template
-->

<template>
    <svg class="ui-spinner" viewBox="0 0 32 32">
        <circle r="16" cx="16" cy="16" />
        <path d="M 29.85640646055102 24 A 16 16 0 0 0 16 0" />
    </svg>
</template>



<!--
    Scripts
-->

<script setup>

</script>

