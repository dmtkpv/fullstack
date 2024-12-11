<!--
    Styles
-->

<style lang="scss">

    .m-share {



        // -----------------
        // Icons
        // -----------------

        &_icons {

            display: flex;
            gap: $gap;
            margin-bottom: $gap;

            div {
                width: 48px;
                height: 48px;
                margin: 0 auto;
                padding: 8px;
                border-radius: 50%;
                background: $blue;
            }

            svg {
                width: 100%;
                height: 100%;
                color: $white;
            }

        }



        // -----------------
        // URL
        // -----------------

        &_url {

            display: flex;
            gap: 12px;

            .i-input {
                flex-grow: 1;
            }

        }



        // -----------------
        // Button
        // -----------------

        &_button {

            position: relative;

            .ui-tooltip {
                white-space: nowrap;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <m-default class="m-share" :title="t('TITLE')">


        <!-- icons -->

        <div class="m-share_icons">
            <a v-for="item in icons" @click="share(item.url)">
                <div>
                    <ui-icon type="custom" :value="item.icon" />
                </div>
                <small>{{ item.label }}</small>
            </a>
        </div>


        <!-- url -->

        <div class="m-share_url">
            <i-input :model-value="url" readonly />
            <div class="m-share_button">
                <ui-button :text="t('COPY')" @click="copy"/>
                <ui-tooltip above v-model="copied">{{ t('COPIED') }}</ui-tooltip>
            </div>
        </div>


    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useText } from '#app/services/utils.js'

    const t = useText('m-share');
    const url = window.location.href;
    const copied = ref(false);
    let timeout;

    const icons = [{
        icon: 'lg-facebook',
        label: t('FACEBOOK'),
        url: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    }, {
        icon: 'lg-linkedin',
        label: t('LINKEDIN'),
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }]

    function copy () {
        navigator.clipboard.writeText(url);
        copied.value = true;
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => copied.value = false, 1500)
    }

    function share (url) {
        window.open(url)
    }

</script>