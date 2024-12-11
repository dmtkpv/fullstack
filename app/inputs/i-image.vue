<!--
    Styles
-->

<style lang="scss">

    .i-image {

        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: $gap;
        padding-bottom: $gap;
        border-bottom: $border;

        .ui-error {
            flex: 0 0 100%;
        }

        ._disabled {
            pointer-events: none;
        }

        &_preview {

            position: relative;
            height: 128px;
            width: 128px;

            a {
                display: flex;
                align-items: center;
                position: absolute;
                bottom: 4px;
                right: 0;
                background: $white;
                border: $border;
                box-shadow: $shadow;
                border-radius: 4px;
                padding: 4px 8px;

                svg {
                    width: 12px;
                    height: 12px;
                    margin-right: 6px;
                }

            }

            .ui-spinner {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                circle { opacity: 0 }
                path { stroke: $blue }
            }

            .ui-image {
                width: 100%;
                img {
                    background: $bg;
                    border: $border;
                    padding: 8px;
                }
            }

        }

        &_upload {

            small {
                display: block;
                margin-bottom: 8px;
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-image">

        <div class="i-image_preview">
            <ui-image :uuid="uuid" :default="props.default" />
            <ui-spinner v-if="pending" />
            <a :class="{ _disabled: pending }" v-if="uuid" @click="del.quiet(uuid)">
                <ui-icon value="sm-trash" />
                <span>{{ t('DELETE') }}</span>
            </a>
        </div>

        <div class="i-image_upload">
            <small>{{ render(t('NOTE'), config) }}</small>
            <ui-upload
                :class="{ _disabled: pending }"
                :text="button"
                :extensions="config.extensions"
                @input="upload.quiet($event[0])"
            />
        </div>

        <ui-error v-if="error" :value="error" />

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { useText, useAPI, useFiles, render } from '#app/services/utils.js'

    const props = defineProps([
        'modelValue',
        'endpoint',
        'default',
        'onSuccess',
        'button'
    ])

    const t = useText('i-image');
    const uuid = ref(props.modelValue);
    const upload = useAPI(props.endpoint);
    const del = useAPI('account-files-delete');
    const config = useFiles('avatar');

    const pending = computed(() => {
        return upload.pending || del.pending
    })

    const error = computed(() => {
        return upload.error || del.error
    })

    del.onSuccess(data => {
        uuid.value = null;
        props.onSuccess?.(null);
    })

    upload.onSuccess(data => {
        uuid.value = data.id;
        props.onSuccess?.(data.id);
    })

</script>