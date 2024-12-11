<!--
    Styles
-->

<style lang="scss">

    .unit-room {

        &.tile {
            padding: 16px;
            margin-bottom: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;

        .unit-application,
        .unit-company,
        .unit-candidate {
            flex-grow: 1;
            margin-right: 12px;
        }

        .unit-candidate_bookmark {
            display: none;
        }



        // -------------------
        // Info
        // -------------------

        &_info {

            display: flex;
            flex-flow: column;
            justify-content: space-between;
            align-items: flex-end;
            flex-shrink: 0;

            .unread {
                display: inline-block;
            }

        }


    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-room">

        <unit-application
            v-if="value.job.id"
            heading="h2"
            :value="value"
        />

        <unit-company
            v-else-if="user.role === 'candidate'"
            heading="h2"
            :value="value.company"
        />

        <unit-candidate
            v-else
            heading="h2"
            :value="value.candidate"
        />

        <div class="unit-room_info">
            <ui-date class="t7" :value="value.messaged_at" :format="today ? 'time' : 'date'" />
            <span v-if="value.unread" class="unread">{{ value.unread }}</span>
        </div>

    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useUser } from '#app/services/utils.js'

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
        heading: {
            type: String,
            required: true
        },
    })

    const user = useUser();

    const today = computed(() => {
        return new Date().toDateString() === new Date(props.value.messaged_at).toDateString()
    })


</script>