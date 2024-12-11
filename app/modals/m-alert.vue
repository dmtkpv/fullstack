<!--
    Styles
-->

<style lang="scss">

    .m-alert {

        text-align: center;
        max-width: 480px;

        &_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: $blue-light;
            color: $blue;
            margin-bottom: $gap;
        }

        &_heading {
            margin-bottom: 4px;
        }

        &_message {
            margin-bottom: 24px;
        }

        .ui-button {
            flex: 1 0 0;
        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="m-alert tile _padded">

        <div class="m-alert_icon" v-if="icon">
            <ui-icon :value="icon" type="lg" />
        </div>

        <h1 class="m-alert_heading h5">{{ heading }}</h1>
        <p class="m-alert_message">{{ message }}</p>

        <div class="row">
            <ui-button v-if="cancel" type="secondary" :text="t('CANCEL')" @click="modal.hide()" />
            <ui-button :text="button" @click="submit" />
        </div>

    </article>
</template>


<!--
    Scripts
-->

<script setup>

    import { useModal, useText } from '#app/services/utils.js'

    const props = defineProps({
        heading: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        button: {
            type: String,
            default: 'OK'
        },
        icon: {
            type: String,
            default: 'lg-exclamation'
        },
        onSuccess: Function,
        cancel: Boolean,
    })

    const t = useText('m-alert');
    const modal = useModal();

    function submit () {
        props.onSuccess?.();
        modal.hide();
    }

</script>