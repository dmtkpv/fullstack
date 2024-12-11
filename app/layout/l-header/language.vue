<!--
    Styles
-->

<style lang="scss">

    .l-header_language {

        display: flex;
        align-items: center;

        span {
            text-transform: uppercase;
        }

        svg {
            margin-left: 6px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="l-header_menu">

        <button class="l-header_language" @click="overlay = !overlay">
            <span>{{ locale }}</span>
            <ui-icon value="sm-down" />
        </button>

        <ui-tooltip v-model="overlay">
            <ui-item
                v-for="{ value, text } in languages"
                :text="t(text)"
                :active="value === locale"
                :disabled="disabled"
                @click="change(value)"
            />
        </ui-tooltip>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { useText, useState, useAPI } from '#app/services/utils.js'

    const t = useText('l-header');
    const { locale } = useState();
    const url = useAPI('content-url');
    const route = useRoute();
    const disabled = ref(false);
    const overlay = ref(false);

    const languages = [
        { value: 'nl', text: 'DUTCH' },
        { value: 'en', text: 'ENGLISH' },
    ]

    function change (locale) {
        const { name, params, query } = route;
        disabled.value = true
        url.fetch({ locale, name, params, query })
    }

    url.onSuccess(data => {
        window.location.href = data.url;
    })

    url.onError(() => {
        disabled.value = false
    })

</script>