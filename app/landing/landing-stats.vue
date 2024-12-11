<!--
    Styles
-->

<style lang="scss">

    .landing-stats {

        overflow: hidden;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;

        @include lg-md {
            gap: 8%;
        }

        @include sm {
            flex-wrap: wrap-reverse;
        }



        // --------------------
        // Figure
        // --------------------

        figure {

            $width: 473;
            $height: 468;

            position: relative;
            flex: 0 0 32%;

            &:before {
                content: '';
                display: block;
                padding-top: calc($height / $width * 100%);
            }

            svg:nth-child(1) {
                fill: $yellow;
                @include rect($width, $height, 0, 0, 80, 80);
            }
            svg:nth-child(2) {
                fill: $blue;
                @include rect($width, $height, 353, 348, 120, 120);
            }

            img {
                border-radius: $radius;
                @include rect($width, $height, 40, 30, 398, 398);
            }

            @include lg-md {
                min-width: 360px;
            }

            @include sm {
                flex-basis: 100%;
                max-width: 360px;
                margin: 0 auto 48px auto;
            }

        }



        // --------------------
        // Section
        // --------------------

        section {

            flex: 1 0 0;

            .t3 {
                color: $black;
                margin-bottom: 48px;
                @include md-sm { font-size: $t4 }
            }

            .h3 {
                color: $blue;
                margin-bottom: 4px;
            }

            ul {
                display: flex;
                justify-content: space-between;
            }

            @include lg-md {
                min-width: 420px;
            }

            @include sm {
                flex-basis: 100%;
            }




        }


    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-stats container-md">

        <section>

            <p class="t3">{{ t('HEADING') }}</p>

            <ul class="ul-reset">
                <li>
                    <p class="h3">{{ t('STAT_1_TITLE') }}</p>
                    <p class="t6">{{ t('STAT_1_DESCRIPTION') }}</p>
                </li>
                <li>
                    <p class="h3">{{ t('STAT_2_TITLE') }}</p>
                    <p class="t6">{{ t('STAT_2_DESCRIPTION') }}</p>
                </li>
                <li>
                    <p class="h3">{{ t('STAT_3_TITLE') }}</p>
                    <p class="t6">{{ t('STAT_3_DESCRIPTION') }}</p>
                </li>
            </ul>

        </section>

        <figure>
            <ui-icon value="il-circle" />
            <ui-icon value="il-ring" />
            <img src="/landing/stats.jpeg">
        </figure>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'
    const t = useText('landing-stats');

</script>