<!--
    Styles
-->

<style lang="scss">

    .wQQrlp {

        max-width: 480px;
        text-align: center;
        padding: 48px;

        img {
            max-width: 96px;
            margin: 0 auto $gap-lg auto;
        }

        p {
            margin-top: 8px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="center">
        <article class="tile wQQrlp">
            <img src="/illustrations/unsubscribe.svg">
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <p>{{ t('MESSAGE') }}</p>
        </article>
    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useMeta } from '#app/services/utils.js'

    defineOptions({

        texts: [
            'route-unsubscribe'
        ],

        preload ({ api }, to) {
            return api('unsubscribe').fetch(to.params)
        }
    })

    const t = useText('route-unsubscribe')

    useMeta();

</script>