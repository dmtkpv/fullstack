<!--
    Styles
-->

<style lang="scss">

    .mJPEI4 {

        nav {
            position: fixed;
            left: 0;
            top: $header;
            bottom: 0;
            width: 320px;
            background: $white;
            box-shadow: $shadow;
            padding: $padding-y $padding-x;

            .ui-button {
                display: none;
            }

            hr {
                display: none;
            }

        }

        @include lg {
            padding-left: 320px;
        }

        @include md-sm {
            nav {
                display: none;
            }
        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="mJPEI4">
        <l-nav />
        <router-view class="container-sm" />
    </main>
</template>



<!--
    Scripts
-->

<script setup>


</script>