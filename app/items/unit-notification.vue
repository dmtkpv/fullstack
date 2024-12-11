<!--
    Styles
-->

<style lang="scss">

    .unit-notification {

        &.tile {
            margin-bottom: 16px;
        }

        &:not(.tile):not(:last-child) {
            border-bottom: $border;
        }



        // -----------------
        // Layout
        // -----------------

        display: flex;
        align-items: flex-start;
        padding: 16px;

        .ui-image {
            width: 48px;
            margin-right: 12px;
        }

        &_content {
            position: relative;
            flex-grow: 1;
            padding-top: 2px;
        }



        // -----------------
        // Heading
        // -----------------

        &_heading {
            margin-bottom: 2px;
            padding-right: 20px;
        }



        // -----------------
        // Bulb
        // -----------------

        &_bulb {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background: $blue;
            border-radius: 50%;
            margin-left: auto;
            flex-shrink: 0;
        }



    }

</style>



<!--
    Template
-->

<template>
    <router-link class="unit-notification" :to="url">

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

        <div class="unit-notification_content">


            <!-- heading -->

            <div class="unit-notification_heading">
                <component class="break t5" :class="!read && 'w6'" :is="heading">{{ body }}</component>
            </div>


            <!-- bulb -->

            <div class="unit-notification_bulb" v-if="!read" />


            <!-- note -->

            <ui-date class="unit-notification_note t7" :value="value.created_at" />


        </div>
    </router-link>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { render, useUser, useTemplate } from '#app/services/utils'

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

    const user = useUser();
    const router = useRouter();

    const read = computed(() => {
        return props.value.created_at <= props.value.visited_at
    })

    const template = useTemplate(props.value.template)
    const body = render(template.body, props.value);
    const options = render(template.route_options, props.value);
    const url = { name: template.route, ...JSON.parse(options) }

</script>