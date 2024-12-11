<!--
    Styles
-->

<style lang="scss">

    .l-form {


        .i-input {
            background: $bg;
            box-shadow: none;
        }



        // -----------------
        // Common
        // -----------------

        display: grid;
        grid-gap: $gap;

        @include lg-md {
            grid-template-columns: 1fr 1fr;
        }



        // -----------------
        // Field
        // -----------------

        &_field {

            min-width: 0;

            &:not(&._half) {
                @include lg-md { grid-column: span 2 }

            }

            label {
                margin-bottom: 8px;
                span { color: $red }
            }

        }



        // -----------------
        // Input
        // -----------------

        &_input {
            display: flex;
            gap: 8px;
            & > * { flex: 1 0 0 }
        }



        // -----------------
        // Note
        // -----------------

        &_note {
            margin-top: 8px;
            &.link { float: right }
        }



        // -----------------
        // Message
        // -----------------

        .ui-error {
            @include lg-md {
                grid-column: span 2;
            }
        }



        // -----------------
        // Modifiers
        // -----------------

        &.tile {
            padding: $gap-lg;
        }



    }

</style>



<!--
    Template
-->

<template>
    <form class="l-form" @submit.prevent="emit('submit')">


        <!-- fields -->

        <template v-for="field in form">
            <div class="l-form_field"
                 v-if="!field.hidden"
                 :class="{ _half: field.half }">

                <label :class="label" v-if="field.label">
                    {{ field.label }}
                    <span v-if="field.required">*</span>
                </label>

                <div class="l-form_input">
                    <component
                        v-for="(input, key) in field.inputs"
                        v-bind="input.options"
                        v-on="input.events || {}"
                        :id="key"
                        :model-value="values[key]"
                        @update:model-value="update(key, $event)"
                        :is="input.component"
                    />
                </div>

                <a
                    v-if="field.note"
                    class="l-form_note"
                    :class="{ link: field.note.onClick }"
                    @click="field.note.onClick">
                    {{ field.note.title }}
                </a>

            </div>
        </template>


        <!-- error -->

        <ui-error v-if="error" :value="error" :form="form" />


        <!-- button -->

        <div class="l-form_field" v-if="button">
            <ui-button :text="button" :disabled="disabled || unchanged" :loading="loading" submit />
        </div>


    </form>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'



    // -------------------
    // Defines
    // -------------------

    const emit = defineEmits([
        'submit',
        'input'
    ])

    const props = defineProps({
        form: Array,
        button: String,
        defaults: Object,
        error: Object,
        loading: Boolean,
        disabled: Boolean,
        value: Object,
        label: {
            type: String,
            default: 'h6'
        }
    })



    // -------------------
    // Data
    // -------------------

    const values = computed(() => {
        return { ...props.defaults, ...props.value }
    })

    const unchanged = computed(() => {
        return Object.keys(props.value).length === 0;
    })



    // -------------------
    // Actions
    // -------------------

    function update (key, value) {
        if (props.defaults?.[key] === value) delete props.value[key];
        else props.value[key] = value;
        emit('input', props.value);
    }



</script>