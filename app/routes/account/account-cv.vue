<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <section>

        <header class="heading">
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </header>

        <div class="tile _padded">
            <i-files
                type="cvs"
                :note="t('NOTE')"
                :button="t('BUTTON')"
                :list="data.list"
                :unit="{ apiUpload: 'account-cvs-create', apiDelete: 'account-cvs-delete' }"
            />
        </div>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { usePreload, useText, useMeta } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'item-file',
            'm-confirm',
            'route-account-cv'
        ],

        preload ({ api }) {
            return {
                list: api('account-cvs-list').fetch()
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-cv' );
    const data = usePreload();

    useMeta();



</script>