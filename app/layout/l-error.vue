<!--
    Styles
-->

<style lang="scss">

    .l-error article {

        max-width: 480px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        img {
            max-width: 256px;
            margin-bottom: 48px;
        }

        p {
            margin-top: 8px;
        }

        .ui-button {
            margin-top: 24px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="center l-error">
        <article>
            <img :src="data.image">
            <h1 class="h3">{{ t(data.heading) }}</h1>
            <p>{{ data.message ? t(data.message) : e(value) }}</p>
            <ui-button :text="t('HOME_BUTTON')" :to="{ name: 'home' }" />
        </article>
    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useText, useError, useAPI, useMeta } from '#app/services/utils.js'

    const props = defineProps(['value'])
    const t = useText('l-error');
    const e = useError();



    // -------------------
    // Content
    // -------------------

    const config = {
        NOT_FOUND: {
            image: '/illustrations/error.svg',
            heading: 'NOT_FOUND_HEADING',
            message: 'NOT_FOUND_MESSAGE'
        },
        FORBIDDEN: {
            image: '/illustrations/forbidden.svg',
            heading: 'FORBIDDEN_HEADING',
            message: 'FORBIDDEN_MESSAGE'
        }
    }

    const data = computed(() => {
        return config[props.value.code] ?? {
            image: '/illustrations/error.svg',
            heading: 'DEFAULT_HEADING'
        }
    })



    // -------------------
    // Meta
    // -------------------

    useMeta(null, {
        title: t(data.value.heading)
    })



</script>