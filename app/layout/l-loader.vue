<!--
    Styles
-->

<style lang="scss">

    .l-loader {



        // -----------------
        // Styles
        // -----------------

        position: fixed;
        left: 0;
        top: $header;
        width: 100%;
        height: 2px;
        overflow: hidden;

        &_spin {

            position: absolute;
            inset: 0;

            span {
                position: absolute;
                inset: 0;
                background: $blue;
            }

            &:nth-child(1) {
                animation: l-loader-spin-1 2s linear infinite;
            }
            &:nth-child(1) span {
                animation: l-loader-span-1 2s linear infinite;
            }
            &:nth-child(2) {
                animation: l-loader-spin-2 2s linear infinite;
            }
            &:nth-child(2) span {
                animation: l-loader-span-2 2s linear infinite;
            }

        }



        // -----------------
        // Animations
        // -----------------

        @keyframes l-loader-spin-1 {
            0% {
                transform: translateX(-145.166611%)
            }
            20% {
                animation-timing-function: cubic-bezier(.5, 0, .701732, .495819);
                transform: translateX(-145.166611%)
            }
            59.15% {
                animation-timing-function: cubic-bezier(.302435, .381352, .55, .956352);
                transform: translateX(-61.495191%)
            }
            to {
                transform: translateX(55.444446%)
            }
        }

        @keyframes l-loader-span-1 {
            0% {
                transform: scaleX(.08)
            }
            36.65% {
                animation-timing-function: cubic-bezier(.334731, .124820, .785844, 1);
                transform: scaleX(.08)
            }
            69.15% {
                animation-timing-function: cubic-bezier(.06, .11, .6, 1);
                transform: scaleX(.661479)
            }
            to {
                transform: scaleX(.08)
            }
        }

        @keyframes l-loader-spin-2 {
            0% {
                animation-timing-function: cubic-bezier(.15, 0, .515058, .409685);
                transform: translateX(-54.888891%)
            }
            25% {
                animation-timing-function: cubic-bezier(.310330, .284058, .8, .733712);
                transform: translateX(-17.236978%)
            }
            48.35% {
                animation-timing-function: cubic-bezier(.4, .627035, .6, .902026);
                transform: translateX(29.497274%)
            }
            to {
                transform: translateX(105.388891%)
            }
        }

        @keyframes l-loader-span-2 {
            0% {
                animation-timing-function: cubic-bezier(.205028, .057051, .576610, .453971);
                transform: scaleX(.08)
            }
            19.15% {
                animation-timing-function: cubic-bezier(.152313, .196432, .648374, 1.004315);
                transform: scaleX(.457104)
            }
            44.15% {
                animation-timing-function: cubic-bezier(.257759, .003163, .211762, 1.381790);
                transform: scaleX(.727960)
            }
            to {
                transform: scaleX(.08)
            }
        }

    }


</style>



<!--
    Template
-->

<template>
    <aside class="l-loader" v-show="pending">
        <div class="l-loader_spin">
            <span />
        </div>
        <div class="l-loader_spin">
            <span />
        </div>
    </aside>
</template>



<!--
    Scripts
-->

<script setup>

    import { useAPI } from '#app/services/utils.js'
    const { pending } = useAPI();

</script>