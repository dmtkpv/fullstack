<!--
    Styles
-->

<style lang="scss">

    .i-wysiwyg {



        // -------------------
        // Loader
        // -------------------

        &_target {
            display: none;
        }
        &_loader {
            height: v-bind(height);
            background: $bg;
        }
        &._loaded &_loader {
            display: none;
        }
        &:not(._loaded) .tox-tinymce {
            display: none;
        }




        // -------------------
        // Reset Styles
        // -------------------

        .tox-tinymce {
            border: $border;
            z-index: 0;
        }

        .tox .tox-edit-area__iframe {
            background-color: $bg;
        }

        .tox:not(.tox-tinymce-inline) .tox-editor-header {
            box-shadow: none;
            border-bottom: $border;
        }



    }

</style>



<!--
    Template
-->

<template>
    <div class="i-wysiwyg" :class="{ _loaded: loaded }">
        <i-input class="i-wysiwyg_loader" disabled />
        <textarea class="i-wysiwyg_target" ref="$el"/>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, onMounted, watch } from 'vue'



    // -------------------
    // Data
    // -------------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: String,
        height: {
            type: String,
            default: '400px'
        }
    })

    const $el = ref(null);
    const loaded = ref(false);



    // -------------------
    // Loader
    // -------------------

    function load (src) {
        return new Promise(resolve => {

            let script = document.head.querySelector(`script[src='${src}']`);

            if (script) {
                if (window.tinymce) return resolve();
                else script.addEventListener('load', resolve);
            }

            else {
                script = document.createElement('script');
                script.addEventListener('load', resolve);
                script.src = src;
                document.head.appendChild(script);
            }

        })
    }



    // -------------------
    // Mount
    // -------------------

    onMounted(async () => {

        await load('/tinymce/tinymce.js')

        const [ editor ] = await tinymce.init({
            target: $el.value,
            menubar: false,
            statusbar: false,
            plugins: 'lists autoresize',
            autoresize_bottom_margin: 0,
            min_height: parseInt(props.height),
            toolbar: 'undo redo | bold italic strikethrough | numlist bullist',
            content_style: `
                body {
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    color: #1e2022;
                }
                p, ul {
                    margin: 1em 0;
                }
                b, strong {
                    font-weight: 600;
                }
            `
        });

        watch(() => props.modelValue, curr => {
            const prev = editor.getContent();
            if (curr !== prev) editor.setContent(curr ?? '');
        }, { immediate: true })

        editor.on('paste change input undo redo', () => {
            emit('update:modelValue', editor.getContent() || null)
        });

        loaded.value = true;

    })




</script>