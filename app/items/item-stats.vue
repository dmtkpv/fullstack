<!--
    Styles
-->

<style lang="scss">

    .item-stats {

        display: flex;
        align-items: center;
        padding: 16px;

        &_icon {
            width: 64px;
            height: 64px;
            padding: 16px;
            border-radius: $radius;
            margin-right: 16px;
        }

        &_value {
            p:first-child { color: inherit }
            p:last-child { color: $black }
        }

        &._blue { color: $blue }
        &._blue &_icon { background: $blue-light }

        &._yellow { color: $yellow }
        &._yellow &_icon { background: $yellow-light }

        &._green { color: $green }
        &._green &_icon { background: $green-light }

    }

</style>



<!--
    Template
-->

<template>
    <div class="item-stats tile" :class="config[type].class">
        <div class="item-stats_icon">
            <ui-icon :value="config[type].icon" type="custom" />
        </div>
        <div class="item-stats_value">
            <p class="h3">{{ value }}</p>
            <p>{{ config[type].text }}</p>
        </div>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#app/services/utils.js'
    const t = useText('item-stats');

    const config = {

        messages: {
            class: '_yellow',
            icon: 'lg-bell',
            text: t('MESSAGES')
        },

        bookmarks: {
            class: '_green',
            icon: 'lg-bookmark',
            text: t('BOOKMARKS')
        },

        applicants: {
            class: '_blue',
            icon: 'lg-users',
            text: t('APPLICANTS')
        },

        jobs: {
            class: '_blue',
            icon: 'lg-jobs',
            text: t('JOBS')
        }

    }

    defineProps([
        'type',
        'value'
    ])

</script>