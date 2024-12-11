<!--
    Styles
-->

<style lang="scss">

    .ui-bookmark {



        // --------------------
        // Icon
        // --------------------

        &.ui-icon {

            &:hover, &._active {
                color: $blue
            }

            &._disabled {
                opacity: .25;
                pointer-events: none;
            }

        }



        // --------------------
        // Button
        // --------------------

        &.ui-button {

            &._active svg {
                color: $blue
            }
        }



    }

</style>


<!--
    Template
-->

<template>
    <ui-auth :roles="roles" @click.prevent>

        <ui-button
            class="ui-bookmark"
            v-if="button"
            type="default"
            :icon="icon"
            :class="{ _active: bookmark }"
            :loading="endpoint.pending"
            @click="endpoint.quiet(bookmark, data)"
        />

        <ui-icon v-else
            class="ui-bookmark"
            :value="icon"
            :class="{ _active: bookmark, _disabled: endpoint.pending }"
            @click="endpoint.quiet(bookmark, data)"
        />

    </ui-auth>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useAPI } from '#app/services/utils'



    // -------------------
    // Props
    // -------------------

    const emit = defineEmits([
        'delete',
        'create'
    ])

    const props = defineProps({
        type: {
            type: String,
            required: true,
            validator: value => ['candidate', 'job'].includes(value),
        },
        value: {
            type: Object,
            required: true
        },
        button: Boolean,
    })



    // -------------------
    // Data
    // -------------------

    const { endpoint, data } = props.type === 'candidate' ? setupCandidate() : setupJob();

    const bookmark = computed(() => {
        return props.value.bookmark;
    });

    const icon = computed(() => {
        return bookmark.value ? 'lg-bookmark-fill' : 'lg-bookmark';
    })

    const roles = computed(() => {
        if (props.type === 'job') return ['candidate'];
        if (props.type === 'candidate') return ['company', 'member'];
    })



    // -------------------
    // Setup
    // -------------------

    function setupCandidate () {
        const endpoint = useAPI('account-favorite-users-toggle');
        const data = { user: props.value.id }
        return { endpoint, data }
    }

    function setupJob () {
        const endpoint = useAPI('account-favorite-jobs-toggle');
        const data = { job: props.value.id }
        return { endpoint, data }
    }



    // -------------------
    // Hooks
    // -------------------

    endpoint.onSuccess(data => {

        if (bookmark.value) {
            props.value.bookmark = null;
            emit('delete');
        }

        else {
            props.value.bookmark = data.id;
            emit('create');
        }

    })


</script>