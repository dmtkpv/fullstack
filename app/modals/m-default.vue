<!--
    Styles
-->

<style lang="scss">

    .m-default {

        max-width: 480px;



        // -----------------
        // Header
        // -----------------

        header {

            display: flex;
            padding: 24px $gap-lg;
            border-bottom: $border;
            align-items: baseline;

            h1 {
                flex-grow: 1;
                &.h3 {
                    @include sm { font-size: $t4 }
                }
            }

            a {
                flex-shrink: 0;
                margin-left: 16px;
                color: $grey;
            }

        }



        // -----------------
        // Section
        // -----------------

        section {

            padding: $gap-lg;

            .l-form .ui-button {
                width: 100%;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <article class="m-default tile">

        <header>
            <h1 :class="`h${font}`">{{ title }}</h1>
            <a @click="modal.hide()" v-if="close">
                <ui-icon value="sm-close" type="md" />
            </a>
        </header>

        <section>
            <slot />
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useModal } from '#app/services/utils.js'

    defineProps({
        title: {
            type: String,
            required: true
        },
        font: {
            type: String,
            default: '3',
            validator: value => ['3', '4', '5'].includes(value)
        },
        close: {
            type: Boolean,
            default: true
        }
    })

    const modal = useModal();

</script>