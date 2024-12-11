<!--
    Styles
-->

<style lang="scss">

    .landing-faq {

        background: $white;



        // --------------------
        // List
        // --------------------

        li {

            &:not(:last-child) {
                border-bottom: $border;
            }

        }



        // --------------------
        // Target
        // --------------------

        &_target {

            display: flex;
            width: 100%;
            align-items: center;
            padding: 24px 0;

            &:after {
                content: '+';
                margin-left: auto;
                padding-left: 16px;
                font-weight: $w4;
            }

            &._active {
                color: $blue;
                &:after { content: '-' }
            }

        }



        // --------------------
        // Accordion
        // --------------------

        &_accordion {

            &.v-enter-active,
            &.v-leave-active {
                overflow: hidden;
                transition: height .3s ease;
            }

            & > div {
                padding-bottom: 24px;
            }

            p {
                margin-bottom: 1em;
            }

        }



        // --------------------
        // Footer
        // --------------------

        footer {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 64px auto 0 auto;
            max-width: max-content;
            padding: 16px 24px;
            gap: 8px;
        }



    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-faq">
        <div class="container-sm">

            <landing-heading :title="t('HEADING')" />

            <ul class="ul-reset">
               <li v-for="(item, index) in value" :key="item.id">
                   <button class="landing-faq_target h4" @click="toggle(index)" :class="{ _active: index === active }">{{ item.question }}</button>
                   <transition
                       @before-enter="min"
                       @enter="max"
                       @after-enter="clear"
                       @before-leave="max"
                       @leave="min"
                       @after-leave="clear">
                       <div class="landing-faq_accordion" v-show="active === index">
                           <div v-html="item.answer"></div>
                       </div>
                   </transition>
               </li>
            </ul>

            <footer class="tile">
                {{ t('FOOTER_TEXT') }}
                <ui-link class="w6" :text="t('FOOTER_LINK')" @click="crisp.toggle()" />
            </footer>

        </div>
    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useText, useCrisp } from '#app/services/utils.js'

    const props = defineProps({
        value: {
            type: Array,
            required: true
        }
    })

    const t = useText('landing-faq');
    const crisp = useCrisp();
    const active = ref(-1);

    function toggle (index) {
        if (index === active.value) active.value = -1;
        else active.value = index;
    }

    function min (el) {
        el.style.height = 0
    }

    function max (el) {
        el.style.height = el.firstElementChild.offsetHeight + 'px'
    }

    function clear (el) {
        el.style.height = ''
    }

</script>