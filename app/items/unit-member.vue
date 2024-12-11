<!--
    Styles
-->

<style lang="scss">

    .unit-member {

        &.tile {
            padding: 16px;
            margin-bottom: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;

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

            padding-right: 36px;

            .h5 {
                line-height: 24px;
            }

        }



        // -------------------
        // Actions
        // -------------------

        &_actions {
            position: absolute;
            top: 0;
            right: 0;
        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-member">
        <ui-image :uuid="value.avatar" default="user" type="circle" />
        <div class="unit-member_content">


            <!-- heading -->

            <div class="unit-member_heading">
                <component class="h5 break" :is="heading">{{ value.first_name }} {{ value.last_name }}</component>
            </div>


            <!-- actions -->

            <ui-actions
                v-if="props.actions"
                class="unit-member_actions"
                :value="actions"
                @edit="onEdit"
                @delete="onDelete"
            />


            <!-- note -->

            <p class="unit-member_note">{{ value.email }}</p>


        </div>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useModal } from '#app/services/utils.js'

    const emit = defineEmits([
        'edit',
        'delete'
    ])

    const props = defineProps({
        actions: Boolean,
        value: {
            type: Object,
            required: true
        },
        heading: {
            type: String,
            required: true
        }
    })

    const t = useText('unit-member');
    const modal = useModal();

    const actions = [
        { text: t('ACTION_EDIT'), value: 'edit' },
        { text: t('ACTION_DELETE'), value: 'delete' }
    ]

    function onEdit () {
        emit('edit', props.value);
    }

    function onDelete () {
        modal.show('confirm', { onSuccess: () => emit('delete', props.value) })
    }

</script>