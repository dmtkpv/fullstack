<!--
    Styles
-->

<style lang="scss">

    .unit-job {

        &.tile {
            margin-bottom: 16px;
            padding: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;
        align-items: flex-start;

        .ui-image {
            margin-right: 12px;
            width: 72px;
            @include sm {
                width: 48px;
                border-radius: 8px;
            }
        }

        &_content {
            position: relative;
            flex-grow: 1;
        }



        // -------------------
        // Heading
        // -------------------

        &_heading {

            padding-right: 28px;
            margin-bottom: 2px;

            .h5 {
                line-height: 24px;
                display: inline;
                margin-right: 8px;
            }

            .ui-tag {
                vertical-align: top;
                margin-right: 8px;
            }

        }



        // -------------------
        // Bookmark
        // -------------------

        &_bookmark {
            position: absolute;
            top: 0;
            right: 0;
        }



        // -------------------
        // Note
        // -------------------

        &_note {
            margin-bottom: 4px;
        }



        // -------------------
        // Labels
        // -------------------

        &_labels {

            gap: 4px 12px;

            &:last-child:not(:empty) {
                margin-top: 8px;
            }

        }



        // -------------------
        // In Hero
        // -------------------

        @at-root .hero & {

            //&_heading .h5 {
            //    font-size: $t3;
            //}

        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-job">
        <ui-image type="square" :uuid="value.image" default="company" />
        <div class="unit-job_content">


            <!-- heading -->

            <div class="unit-job_heading">
                <component class="h5 break" :is="heading">{{ value.title }}</component>
                <ui-tag v-if="value.archived" type="grey" :text="t('ARCHIVED')" />
                <ui-tag v-else-if="status" :type="status.type" :text="status.text" />
            </div>


            <!-- bookmark -->

            <ui-bookmark
                class="unit-job_bookmark"
                type="job"
                :value="value"
                @delete="emit('bookmark', false)"
                @create="emit('bookmark', true)"
            />


            <!-- note -->

            <p class="unit-job_note break t6">{{ value.company_name }}</p>


            <!-- badges -->

            <div class="unit-job_labels row">
                <ui-badge icon="lg-location" :text="value.city" />
                <ui-badge v-if="hours" icon="lg-clock" :text="hours" />
                <ui-badge v-if="salary" icon="lg-salary" :text="salary" />
            </div>


            <!-- tags -->

            <div class="unit-job_labels row">
                <ui-tag v-if="value.urgent" type="blue-light" :text="t('URGENT')" />
                <ui-tag v-if="value.type" type="yellow-light" :text="getListText(lists.job_types, value.type)" />
            </div>


        </div>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useLists, useText, useJob, useUser, getListText, useStatuses } from '#app/services/utils.js'

    const emit = defineEmits([
        'bookmark'
    ])

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

    const t = useText('unit-job');
    const user = useUser();
    const lists = useLists();
    const statuses = useStatuses({ t });
    const { hours, salary } = useJob(props.value);

    const status = computed(() => {
        return statuses.find(status => status.value === props.value.status)
    })

</script>