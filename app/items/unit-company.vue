<!--
    Styles
-->

<style lang="scss">

    .unit-company {

        &.tile {
            padding: 16px;
            margin-bottom: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;
        align-items: flex-start;

        .ui-image {
            width: 56px;
            margin-right: 12px;
        }

        &_content {
            position: relative;
            flex-grow: 1;
            padding-top: 4px;
        }



        // -------------------
        // Heading
        // -------------------

        &_heading {

            .h5 {
                line-height: 24px;
            }

        }



        // -------------------
        // Note
        // -------------------

        &_note {
            color: $grey;
        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-company">
        <ui-image :uuid="value.image" default="company" type="square" />
        <div class="unit-company_content">


            <!-- heading -->

            <div class="unit-company_heading">
                <component class="h5 break" :is="heading">{{ value.name }}</component>
            </div>


            <!-- note -->

            <p class="unit-company_note">
                {{ value.email }}
            </p>


        </div>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
        heading: {
            type: String,
            required: true
        }
    })

</script>