<!--
    Styles
-->

<style lang="scss">

    .landing-partners {

        background: $white;

        section {

            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 32px 96px;

            img {
                width: 96px;
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-partners">
        <div class="container-md">

            <landing-heading :title="t('HEADING')"/>

            <section>
                <img src="/landing/partner-1.png">
                <img src="/landing/partner-2.png">
                <img src="/landing/partner-3.png">
                <img src="/landing/partner-4.png">
                <img src="/landing/partner-5.png">
                <img src="/landing/partner-6.png">
                <img src="/landing/partner-7.png">
                <img src="/landing/partner-8.png">
            </section>

        </div>
    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'
    const t = useText('landing-partners');

</script>