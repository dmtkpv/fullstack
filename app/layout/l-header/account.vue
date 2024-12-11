<!--
    Styles
-->

<style lang="scss">



    // --------------------
    // Button
    // --------------------

    .l-header_account {

        display: flex;
        align-items: center;

        .ui-image {
            width: 40px;
        }

        span {
            margin-left: 8px;
        }

        svg {
            margin-left: 6px;
        }

        @include sm {
            span { display: none }
            svg { display: none }
        }

    }



    // --------------------
    // Menu
    // --------------------

    .YGMxWN {

        .ui-button {
            margin-bottom: 12px;
        }

        hr {
            margin: 8px 0;
        }

        @at-root .ui-tooltip & {
            width: 240px;
            .ui-icon { display: none }
        }

        @at-root .l-sidebar & {
            width: 260px;
        }

    }



</style>



<!--
    Template
-->

<template>
    <div class="l-header_menu">

        <a class="l-header_account" @click="active = !active">
            <ui-image :uuid="user.avatar" default="user" />
            <span v-if="user.first_name">{{ user.first_name }} {{ user.last_name }}</span>
            <ui-icon value="sm-down" />
        </a>

        <ui-responsive v-model="active" v-bind="responsive" class="YGMxWN">
            <l-nav />
        </ui-responsive>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useUser } from '#app/services/utils'

    const user = useUser();
    const active = ref(false);

    const responsive = {
        type: 'ui-tooltip',
        sm: 'ui-sidebar',
        options: {
            'ui-sidebar': {
                position: 'right'
            }
        }
    }

</script>