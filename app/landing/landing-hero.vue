<!--
    Styles
-->

<style lang="scss">

    .landing-hero {

        display: flex;
        align-items: center;
        gap: 8%;


        // --------------------
        // Section
        // --------------------

        section {

            flex: 1 0 0;

            @include lg-md {
                min-width: 440px;
            }

            h1 {

                span {
                    display: inline-block;
                    color: $blue;
                    background: linear-gradient(180deg, rgba(245,202,153,.5), rgba(245,202,153,.5)) repeat-x left 1.1em / 1em 0.2em;
                }

                @include md-sm {
                    font-size: 48px;
                }

            }

        }



        // --------------------
        // Figure
        // --------------------

        figure {

            $width: 445;
            $height: 465;

            position: relative;
            flex: 1 0 0;

            &:before {
                content: '';
                display: block;
                padding-top: calc($height / $width * 100%);
            }

            img {
                border-radius: 50%;
            }

            img, svg {
                animation-fill-mode: backwards;
                animation-duration: .9s;
                animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1), cubic-bezier(0.33, 1, 0.68, 1);;
            }

            svg:nth-child(1) {
                color: $blue;
                @include rect($width, $height, 0, 0, 120, 120);
                animation-name: landing-hero-bottom, landing-hero-fade;
                animation-delay: .5s;
            }

            svg:nth-child(2) {
                color: $green;
                @include rect($width, $height, 212, 176, 25, 25);
                animation-name: landing-hero-right, landing-hero-fade;
                animation-delay: .5s;
            }

            svg:nth-child(3) {
                color: $yellow;
                @include rect($width, $height, 379, 128, 50, 50);
                animation-name: landing-hero-left, landing-hero-fade;
                animation-delay: .7s;
            }

            img:nth-child(4) {
                @include rect($width, $height, 0, 72, 200, 200);
                animation-name: landing-hero-right, landing-hero-fade;
            }

            img:nth-child(5) {
                @include rect($width, $height, 208, 0, 165, 165);
                animation-name: landing-hero-left, landing-hero-fade;
                animation-delay: .2s;
            }

            img:nth-child(6) {
                @include rect($width, $height, 165, 185, 280, 280);
                animation-name: landing-hero-left, landing-hero-fade;
                animation-delay: .4s;
            }

            @keyframes landing-hero-fade {
                0% { opacity: 0 }
            }
            @keyframes landing-hero-left {
                0% { transform: translateX(64px); }
            }
            @keyframes landing-hero-right {
                0% { transform: translateX(-64px); }
            }
            @keyframes landing-hero-top {
                0% { transform: translateY(-64px); }
            }
            @keyframes landing-hero-bottom {
                0% { transform: translateY(64px); }
            }

            @include lg-md {
                min-width: 320px;
            }

            @include sm {
                display: none;
            }

        }



    }
</style>



<!--
    Template
-->

<template>
    <article class="landing-hero container-md">
        <section>
            <slot />
        </section>
        <figure>
            <ui-icon value="il-ring" />
            <ui-icon value="il-circle" />
            <ui-icon value="il-circle" />
            <img src="/landing/hero-1.jpeg">
            <img src="/landing/hero-2.jpeg">
            <img src="/landing/hero-3.jpeg">
        </figure>
    </article>
</template>



<!--
    Scripts
-->

<script setup>

</script>