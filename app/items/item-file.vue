<!--
    Styles
-->

<style lang="scss">

    .item-file {

        border: $border;

        .ui-spinner {
            height: 24px;
        }

        .ui-image {
            width: 30px;
            border-radius: 3px;
        }

        p {
            flex-grow: 1;
        }

        &_clear {
            padding: 6px;
        }

        &._error {
            color: $red;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="item-file box" :class="{ _error: error }">

        <template v-if="error">
            <ui-icon value="lg-error" />
            <p class="cut">{{ e(error) }}</p>
            <a class="item-file_clear" v-if="upload.error" @click="emit('delete')">
                <ui-icon value="sm-close" />
            </a>
        </template>

        <template v-else-if="file">
            <ui-spinner />
            <p class="cut">{{ value.name }}</p>
        </template>

        <template v-else>
            <ui-image v-if="preview" :uuid="value.id" />
            <ui-icon v-else value="lg-file" />
            <p class="cut">{{ value.filename_download }}</p>
            <ui-actions :value="actions" @delete="remove" @download="download(value.id)" />
        </template>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useAPI, useError, useText, useSSR, download } from '#app/services/utils.js'



    // -----------------
    // Config
    // -----------------

    const emit = defineEmits([
        'delete',
        'upload'
    ])

    const props = defineProps({
        value: {
            type: Object, // File || { id, filename_download }
            required: true
        },
        apiUpload: {
            type: String,
            required: true
        },
        apiDelete: {
            type: String,
            default: 'account-files-delete'
        },
        apiParams: undefined
    })



    // -----------------
    // Data
    // -----------------

    const e = useError();
    const t = useText('item-file')
    const ssr = useSSR();
    const del = useAPI(props.apiDelete);
    const upload = useAPI(props.apiUpload);

    const actions = [
        { text: t('ACTION_DOWNLOAD'), value: 'download' },
        { text: t('ACTION_DELETE'), value: 'delete' }
    ]

    const file = computed(() => {
        return !ssr && props.value instanceof File
    })

    const loading = computed(() => {
        return upload.pending || del.pending;
    })

    const error = computed(() => {
        return upload.error || del.error;
    })

    const preview = computed(() => {
        const ext = props.value.filename_download?.split('.').pop();
        return ['jpg', 'png', 'jpeg'].includes(ext);
    })



    // -----------------
    // API Hooks
    // -----------------

    del.onSuccess(() => {
        emit('delete');
    })

    upload.onSuccess(data => {
        emit('upload', data);
    })



    // -----------------
    // Actions
    // -----------------

    function remove () {
        del.quiet(props.value.id, props.apiParams);
    }

    if (file.value) {
        upload.quiet(props.value, props.apiParams);
    }


</script>