<!--
    Styles
-->

<style lang="scss">



    // -----------------
    // Root
    // -----------------

    .AiFvcO {
        display: grid;
        gap: $padding-y;
    }



    // -----------------
    // Stats
    // -----------------

    .eYDIZC {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
        grid-gap: 16px;
    }



    // -----------------
    // Notifications
    // -----------------

    .YLQWkA {

        padding: $gap;

        .unit-notification {
            padding-left: 0;
            padding-right: 0;
            &:first-child { padding-top: 0 }
            &:last-child { padding-bottom: 0 }
        }

    }



    // -----------------
    // Views
    // -----------------

    .uSMs1J {
        padding: $gap;
    }



</style>



<!--
    Template
-->

<template>
    <section class="AiFvcO">


        <!-- stats -->

        <article>

            <header class="heading">
                <h1 class="h3">
                    <span>{{ t('GREETING') }}</span>
                    <span v-if="user.first_name">&nbsp;{{ user.first_name }}</span>
                    <span>!</span>
                </h1>
            </header>

            <div class="eYDIZC">
                <item-stats :type="user.role === 'candidate' ? 'jobs' : 'applicants'" :value="data.applications" />
                <item-stats type="bookmarks" :value="data.favorites" />
            </div>

        </article>


        <!-- notification -->

        <article v-if="user.notifications?.length">

            <header class="heading">
                <h2 class="h4">{{ t('NOTIFICATIONS') }}</h2>
                <ui-link v-if="user.notifications.length > 4" :to="{ name: 'account-notifications' }" text="View more" />
            </header>

            <div class="tile YLQWkA">
                <unit-notification v-for="notification in user.notifications" heading="h3" :key="notification.id" :value="notification" />
            </div>

        </article>


        <!-- views -->

        <article>

            <header class="heading">
                <h1 class="h4">{{ t('VIEWS') }}</h1>
            </header>

            <ui-views class="tile uSMs1J" :days="days" :views="data.views" />

        </article>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useUser, usePreload, useText, useMeta } from '#app/services/utils'
    const days = 14;



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'item-stats',
            'route-account-dashboard',
        ],

        preload ({ api, state }) {
            return {
                views: api('account-views').fetch({ days }),
                applications: api('account-applications-count').fetch(),
                favorites: state.user.role === 'candidate' ? api('account-favorite-jobs-count').fetch() : api('account-favorite-users-count').fetch()
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-dashboard');
    const user = useUser();
    const data = usePreload();

    useMeta();



</script>