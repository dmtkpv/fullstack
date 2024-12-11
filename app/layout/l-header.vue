<!--
    Styles
-->

<style lang="scss">

    .l-header {



        // --------------------
        // Common
        // --------------------

        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: $header;
        background: $white;
        box-shadow: $shadow;
        display: flex;
        align-items: center;

        @include lg-md {
            gap: 24px;
            padding: 0 $padding-x;
        }

        @include sm {
            gap: 16px;
            padding: 0 12px;
        }



        // --------------------
        // Menu
        // --------------------

        &_menu {
            position: relative;
            height: $header;
            display: flex;
            align-items: center;
        }



    }

</style>



<!--
    Template
-->

<template>
    <header class="l-header">

        <header-logo />
        <header-language />
        <header-auth v-if="!user.id" />

        <template v-else>
            <header-favorites />
            <header-notifications />
            <header-messages />
            <header-account />
        </template>

    </header>
</template>



<!--
    Scripts
-->

<script setup>

    import { createQueue } from '@vacature/shared/utils.js'
    import { useUser, useAPI, useIo } from '#app/services/utils'
    import HeaderLogo from './l-header/logo.vue'
    import HeaderLanguage from './l-header/language.vue'
    import HeaderAuth from './l-header/auth.vue'
    import HeaderFavorites from './l-header/favorites.vue'
    import HeaderMessages from './l-header/messages.vue'
    import HeaderNotifications from './l-header/notifications.vue'
    import HeaderAccount from './l-header/account.vue'



    // -------------------
    // Data
    // -------------------

    const user = useUser();
    const io = useIo();

    const apis = [
        {
            endpoint: useAPI('account-messages-list'),
            params: { notification: true, limit: 5 }
        },
        {
            endpoint: useAPI('account-messages-count'),
            params: { notification: true, read: false }
        },
        {
            endpoint: useAPI('account-messages-count'),
            params: { read: false }
        }
    ]



    // -------------------
    // Listeners
    // -------------------

    apis.forEach(({ endpoint }) => {
        endpoint.onFetch(({ config }) => {
            config.uncanceled = true
        })
    })

    io.on('update', createQueue(async () => {
        const requests = apis.map(({ endpoint, params }) => endpoint.fetch(params));
        const data = await Promise.all(requests);
        Object.assign(user, {
            notifications: data[0],
            unread: { notifications: data[1], messages: data[2] }
        })
    }, 5000))



</script>