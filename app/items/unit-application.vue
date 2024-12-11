<!--
    Styles
-->

<style lang="scss">

    .unit-application {

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

            small {
                vertical-align: top;
                margin-left: 4px;

            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-application">

        <ui-image
            v-if="user.role === 'candidate'"
            type="square"
            default="company"
            :uuid="value.company.image"
        />

        <ui-image
            v-else
            type="circle"
            default="user"
            :uuid="value.candidate.avatar"
        />

        <div class="unit-application_content">


            <!-- heading -->

            <div class="unit-application_heading">
                <component class="h5 break" :is="heading">{{ name }}</component>
            </div>


            <!-- note -->

            <p class="unit-application_note">
                {{ value.job.title }}
                <ui-tag :type="status.type" :text="status.text" />
            </p>


        </div>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useUser, useText, useStatuses } from '#app/services/utils.js'

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

    const t = useText('unit-application');
    const user = useUser();
    const statuses = useStatuses({ t });

    const status = computed(() => {
        return statuses.find(status => status.value === props.value.status)
    })

    const name = computed(() => {
        if (user.role === 'candidate') return props.value.company.name;
        return props.value.candidate.first_name + ' ' + props.value.candidate.last_name;
    })

</script>