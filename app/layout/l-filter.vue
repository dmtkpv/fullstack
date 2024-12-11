<!--
    Styles
-->

<style lang="scss">

    .l-filter {

        display: flex;
        align-items: flex-start;
        gap: 24px;




        // --------------------
        // Layout
        // --------------------

        aside {
            flex: 0 0 320px;
        }

        section {

            flex-grow: 1;
            min-width: 0;

            .i-search {
                max-width: 400px;
                margin-bottom: 24px;
            }

            .heading > button {
                @include lg { display: none }
            }

        }

        @at-root .l-sidebar .nFvGbk {
            width: 320px;
        }

        @at-root .KizCEs {
            margin-bottom: $gap-lg;
            align-items: center;
            justify-content: space-between;
        }



        // --------------------
        // Tags
        // --------------------

        &_tags {

            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            &:not(:empty) {
                margin-bottom: $gap;
            }

            button {

                display: flex;
                align-items: center;
                @extend %blue;
                height: 32px;
                border-radius: 16px;
                padding: 0 12px;
                overflow: hidden;

                &:hover {
                    @extend %blue-dark;
                }

                span {
                    margin-right: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                svg {
                    flex-shrink: 0;
                }

            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <main class="l-filter container-md">


        <!-- filters -->

        <ui-responsive v-model="sidebar" v-bind="responsive" class="nFvGbk">

            <div class="KizCEs row">
                <p class="h4">{{ t('FILTER') }}</p>
                <a @click="reset" class="link" v-if="filtered">{{ t('RESET') }}</a>
            </div>

            <l-form :form="form" :value="data.query" @input="input" />

        </ui-responsive>


        <!-- content -->

        <section>

            <i-search :suggestions="suggestions" :placeholder="t(`${search.toUpperCase()}_PLACEHOLDER`)" />

            <header class="heading">
                <p>
                    <span v-if="data.list.length" v-html="render(t('COUNT'), counts)" />
                    <b>&nbsp;{{ data.count.total }}&nbsp;</b>
                    <span>{{ t(search.toUpperCase()) }}</span>
                </p>
                <slot name="header" />
                <ui-button :text="t('FILTER')" @click="sidebar = !sidebar" />
            </header>

            <div class="l-filter_tags">
                <template v-for="(text, key) in tags" :key="key">
                    <button v-if="data.query[key]" @click="clear(key)">
                        <span class="t6">{{ text(data.query[key]) }}</span>
                        <ui-icon value="sm-close" />
                    </button>
                </template>
            </div>

            <slot />

        </section>


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { usePreload, useText, useReset, render } from '#app/services/utils'

    const props = defineProps([
        'form',
        'tags',
        'suggestions',
        'search'
    ])

    const t = useText('l-filter');
    const route = useRoute();
    const router = useRouter();
    const sidebar = ref(false);
    const data = usePreload();
    const reset = useReset();

    const responsive = {
        type: 'ui-sidebar',
        lg: 'aside',
        options: {
            'ui-sidebar': {
                hideOn: 'path'
            },
            aside: {
                class: 'tile _padded'
            }
        }
    }

    const counts = computed(() => {
        const page = data.query.page ?? 1;
        const from = (page - 1) *  data.limit;
        const to = from + data.list.length;
        return { from, to };
    })

    const filtered = computed(() => {
        const { page, sort, ...filters } = data.query;
        return Object.values(filters).some(filter => !!filter);
    })

    function input (query) {
        router.push({ query: { ...query, page: 1 } })
    }

    function clear (key) {
        const { [key]: omit, ...query } = data.query;
        input(query);
    }



</script>