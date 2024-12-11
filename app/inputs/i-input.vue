<!--
    Styles
-->

<style lang="scss">

    .i-input {



        // -----------------
        // Common
        // -----------------

        position: relative;
        border: $border;
        cursor: text;

        input {

            background: none;
            height: 30px;
            width: 100%;
            cursor: inherit;

            &::placeholder {
                opacity: .5;
            }

        }



        // -----------------
        // Modifiers
        // -----------------

        &._focused {
            border-color: $blue;
        }
        &._disabled {
            pointer-events: none;
        }


    }

</style>



<!--
    Template
-->

<template>
    <div ref="$el" class="i-input box" :class="{ _focused: focused, _disabled: disabled }" @mousedown="down">

        <ui-icon v-if="icon" type="md" :value="icon" />
        <slot name="before" />

        <input
            ref="$input"
            :value="modelValue"
            :type="type"
            :readonly="readonly"
            :disabled="disabled"
            :required="required"
            :placeholder="placeholder"
            @input="emit('update:modelValue', $event.target.value || null)"
            @focus="focused = true"
            @blur="focused = false"
        />

        <slot name="after" />

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'



    // -------------------
    // Define
    // -------------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: [String, Number],
        icon: String,
        type: String,
        required: Boolean,
        readonly: Boolean,
        disabled: Boolean,
        placeholder: String,
    })



    // -------------------
    // Data
    // -------------------

    const $el = ref(null);
    const $input = ref(null);
    const focused = ref(false);



    // -------------------
    // Actions
    // -------------------

    function down (event) {
        if (event.target === $input.value) return;
        $input.value.focus();
        event.preventDefault();
    }



    // -------------------
    // Expose
    // -------------------

    defineExpose({
        focused
    })



</script>