<!--
    Styles
-->

<style lang="scss">

    .item-message {



        // -------------------
        // Layout
        // -------------------

        display: flex;
        align-items: flex-start;

        &_image {
            width: 48px;
            margin-right: 12px;
        }

        &_content {
            position: relative;
            flex-grow: 1;
            padding-top: 2px;
        }



        // -------------------
        // Heading
        // -------------------

        &_heading {
            margin-bottom: 2px;
        }



        // -------------------
        // Candidate
        // -------------------

        &_candidate {

            margin-top: 16px;

            .ui-image {
                max-width: 192px;
            }

            .h4 {
                margin-top: 16px;
            }

            .h4 + p {
                margin-top: 8px;
            }

            .row:not(:empty) {
                margin-top: 16px;
            }


        }



        // -------------------
        // Message
        // -------------------

        &_message {
            margin-top: 16px;
            padding: 16px;
            background: $blue-light;
            border-radius: $radius;
            display: inline-block;
        }



        // -------------------
        // Template
        // -------------------

        &_template {

            margin-top: 16px;

            .h5 {
                margin-bottom: 8px;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <div class="item-message">
        <ui-image class="item-message_image" type="circle" default="user" :uuid="value.created_by.avatar" />
        <div class="item-message_content">


            <!-- heading -->

            <h2 class="item-message_heading break h5">{{ getName(value.created_by) }}</h2>
            <ui-date class="t7" :value="value.created_at" />


            <!-- template -->

            <div class="item-message_template" v-if="value.template">

                <p class="h5">{{ templates[value.template] }}</p>

                <ui-tag
                    v-if="value.template === 'APPLICATION_REJECTED'"
                    type="red"
                    text="Rejected"
                />

                <ui-tag
                    v-if="value.template === 'APPLICATION_APPROVED'"
                    type="green"
                    text="Approved"
                />

                <div class="row" v-if="value.template === 'APPLICATION_CREATED'">
                    <slot />
                </div>

            </div>


            <!-- candidate -->

            <div class="item-message_candidate" v-if="value.template === 'APPLICATION_CREATED'">

                <ui-image
                    v-if="room.candidate.avatar"
                    type="square"
                    :uuid="room.candidate.avatar"
                />

                <p class="h4">{{ getName(room.candidate) }}</p>

                <p v-if="education_field">
                    <b>Education:</b> {{ education_field }}
                    <span v-if="education_level"> ({{ education_level }})</span>
                </p>

                <p v-if="languages">
                    <b>Languages:</b> {{ languages }}
                </p>

                <div class="row">
                    <ui-button
                        v-if="cv"
                        type="default"
                        text="Download CV"
                        @click="download(cv)"
                    />
                    <ui-button
                        v-if="user.role !== 'candidate'"
                        type="default"
                        text="Show profile"
                        :to="{ name: 'candidate', params: { id: room.candidate.id } }"
                    />
                </div>

            </div>


            <!-- message -->

            <p class="item-message_message" v-if="value.message" v-html="value.message" />


        </div>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { TEMPLATES } from '@vacature/shared/constants.js'
    import { getListText, useLists, useTemplate, useUser, render, download } from '#app/services/utils.js'



    // -------------------
    // Options
    // -------------------

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
        room: {
            type: Object,
            required: true
        }
    })



    // -------------------
    // Data
    // -------------------

    const lists = useLists();
    const user = useUser();
    const templates = {};

    const cv = computed(() => {
        return props.value.attachment || props.room.candidate.cv
    })

    const education_field = computed(() => {
        return getListText(lists.education_fields, props.room.candidate.education_field)
    })

    const education_level = computed(() => {
        return getListText(lists.education_levels, props.room.candidate.education_level)
    })

    const languages = computed(() => {
        return getListText(lists.languages, props.room.candidate.languages)
    })



    // -------------------
    // Helpers
    // -------------------

    function getName ({ first_name, last_name }) {
        return first_name + ' ' + last_name
    }

    function setTemplate (key) {
        templates[key] = render(useTemplate(key).body, props.room);
    }



    // -------------------
    // Set templates
    // -------------------

    TEMPLATES.forEach(setTemplate);



</script>