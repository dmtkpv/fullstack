<!--
    Styles
-->

<style lang="scss">

    .YHRx8q {

        max-width: 512px;
        margin: 0 auto;
        padding: 64px $gap-lg;



        // --------------------
        // Candidate
        // --------------------

        .unit-candidate {

            display: block;
            text-align: center;

            .ui-image {
                width: 96px;
                margin: 0 auto 16px auto;
            }

            .ui-auth {
                display: none;
            }

            .row {
                justify-content: center;
            }

        }



        // --------------------
        // Buttons
        // --------------------

        & > .row {
            margin-top: $gap;
            justify-content: center;
        }



    }

</style>



<!--
    Template
-->

<template>
    <main class="container-sm">
        <section class="tile YHRx8q">

            <unit-candidate :value="data.item" heading="h1" font="3" />

            <div class="row">
                <ui-button :disabled="!data.item.cv" :text="t('BUTTON_DOWNLOAD')" @click="download(data.item.cv)" />
                <ui-auth :roles="['member', 'company']">
                    <ui-message :candidate="data.item.id" icon="lg-message" type="default" />
                </ui-auth>
                <ui-phone v-if="data.item.phone" :value="data.item.phone" />
                <ui-bookmark type="candidate" :value="data.item" button />
            </div>

        </section>
    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { usePreload, useText, useUser, download, useMeta } from '#app/services/utils'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        lists: [
            'education_fields',
            'education_levels',
        ],

        texts: [
            'route-candidate',
            'm-message'
        ],

        preload ({ api, state }, to) {
            return {
                view: api('view-user').quiet(to.params.id),
                item: api('candidates-item').fetch(to.params.id)
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-candidate')
    const data = usePreload();
    const user = useUser();

    useMeta(data.item)



</script>