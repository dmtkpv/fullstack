<!--
    Styles
-->

<style lang="scss">

    .landing-mobile {

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
        // Aside
        // --------------------

        figure {

            $width: 408;
            $height: 664;

            position: relative;
            flex: 0 0 32%;

            &:before {
                content: '';
                display: block;
                padding-top: calc($height / $width * 100%);
            }

            svg:nth-child(1) {
                fill: $yellow;
                @include rect($width, $height, 0, 0, 160, 160);
            }

            svg:nth-child(2) {
                fill: $blue;
                @include rect($width, $height, 248, 504, 160, 160);
            }

            img {
                @include rect($width, $height, 60, 60, 288, 576);
            }

            @include lg-md {
                min-width: 280px;
            }

            @include sm {
                flex-basis: 100%;
                max-width: 320px;
                margin: 0 auto 48px auto;
            }

        }



        // --------------------
        // Section
        // --------------------

        section {

            flex: 1 0 0;

            .t4 {
                margin: 8px 0 32px 0;
            }

            @include lg-md {
                min-width: 420px;
            }

            @include sm {
                flex-basis: 100%;
            }


        }



        // --------------------
        // Actions
        // --------------------

        &_actions {

            display: flex;
            flex-wrap: wrap;

            @include lg-md {
                gap: 24px;
            }

            @include sm {
                gap: 16px;
            }

            a {
                background: $black;
                color: $white;
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border-radius: $radius;

                span {
                    display: block;
                    white-space: nowrap;
                }

                svg {
                    margin-right: 12px;
                }

                &:hover {
                    background: $blue;
                }

                @include sm {
                    flex-grow: 1;
                    max-width: 144px;
                    padding: 8px;
                    svg { margin-right: 8px; }
                    .w5 { font-size: $t6; }
                }

            }

        }

    }

</style>


<!--
    Template
-->

<template>
    <article class="landing-mobile container-md">

        <section>
            <h2 class="h2">{{ t('HEADING') }}</h2>
            <p class="t4">{{ t('DESCRIPTION') }}</p>
            <div class="landing-mobile_actions">
                <a :href="t('IOS_URL')" target="_blank">
                    <ui-icon value="lg-appstore" />
                    <p>
                        <span class="t7">{{ t('IOS_LABEL') }}</span>
                        <span class="w5">{{ t('IOS_TITLE') }}</span>
                    </p>
                </a>
                <a :href="t('ANDROID_URL')" target="_blank">
                    <ui-icon value="lg-googleplay" />
                    <p>
                        <span class="t7">{{ t('ANDROID_LABEL') }}</span>
                        <span class="w5">{{ t('ANDROID_TITLE') }}</span>
                    </p>
                </a>
            </div>

        </section>

        <figure>
            <ui-icon value="il-circle" />
            <ui-icon value="il-ring" />
            <img src="/landing/mobile.png">
        </figure>

    </article>
</template>


<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'
    const t = useText('landing-mobile');

</script>