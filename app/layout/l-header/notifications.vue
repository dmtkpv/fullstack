<!--
    Styles
-->

<style lang="scss">



    // --------------------
    // Menu
    // --------------------

    .ZRA6q6 {

        padding: 0 !important;
        width: 280px;

        .unit-notification {
            padding: 16px;
        }

        .link {
            display: block;
            padding: 16px;
            text-align: center;
        }

    }



</style>



<!--
    Template
-->

<template>
    <div class="l-header_menu">

        <header-icon
            icon="lg-bell"
            :count="user.unread.notifications"
            @click="click"
        />

        <ui-responsive v-model="active" v-bind="responsive" class="ZRA6q6">
            <unit-notification v-for="notification in user.notifications" heading="p" :key="notification.id" :value="notification" />
            <router-link v-if="user.notifications.length > 4" :to="{ name: 'account-notifications' }" class="link">View more</router-link>
        </ui-responsive>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUser } from '#app/services/utils'
    import HeaderIcon from './icon.vue'



    // -------------------
    // Data
    // -------------------

    const user = useUser();
    const router = useRouter();
    const active = ref(false);

    const responsive = {
        type: 'ui-tooltip',
        sm: 'ui-sidebar',
        options: {
            'ui-sidebar': {
                position: 'right'
            }
        }
    }



    // -------------------
    // Actions
    // -------------------

    function click () {
        if (user.notifications.length) active.value = !active.value;
        else router.push({ name: 'account-notifications' });
    }



</script>