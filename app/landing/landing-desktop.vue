<!--
    Styles
-->

<style lang="scss">

    .landing-desktop {

        @include lg {
            display: flex;
            align-items: center;
            gap: 48px;
        }



        // --------------------
        // Figure
        // --------------------

        figure {

            border-radius: $radius;
            overflow: hidden;

            img {
                width: 100%;
            }

            @include lg {
                flex: 0 0 60%;
            }

            @include md-sm {
                margin-bottom: 48px;
            }

        }



        // --------------------
        // Figure Caption
        // --------------------

        figcaption {

            position: relative;
            background: $white;
            height: 30px;
            display: flex;
            align-items: center;
            padding: 0 12px;

            i {
                width: 8px;
                height: 8px;
                background: $grey-light;
                border-radius: 50%;
                margin-right: 4px;
            }

            span {
                position: absolute;
                left: 15%;
                top: 9px;
                width: 70%;
                height: 12px;
                background: $grey-light;
                text-align: center;
                font-size: 8px;
                border-radius: 4px;
            }

        }



        // --------------------
        // Section
        // --------------------

        section {

            p {
                margin: 24px 0;
            }

        }



        // --------------------
        // Actions
        // --------------------

        &_actions {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
        }


    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-desktop container-md">

        <figure>
            <figcaption>
                <i />
                <i />
                <i />
                <span>stage-app.nl</span>
            </figcaption>
            <img src="/landing/map.jpeg">
        </figure>

        <section>
            <h2 class="h3">{{ t('HEADING') }}</h2>
            <p>{{ t('DESCRIPTION') }}</p>
            <div class="landing-desktop_actions" v-if="!user.id">
                <ui-button :text="t('REGISTER')" @click="modal.show('auth-register', { type: 'company' })" />
                <ui-link :text="t('LOGIN')" @click="modal.show('auth-login')" />
            </div>
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useUser, useModal } from '#app/services/utils.js'
    const t = useText('landing-desktop');
    const user = useUser();
    const modal = useModal();

</script>