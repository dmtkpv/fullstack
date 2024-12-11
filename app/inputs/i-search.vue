<!--
    Styles
-->

<style lang="scss">

    .i-search {

        position: relative;
        display: flex;
        padding: 8px;

        .i-input {
            flex-grow: 1;
            border: none;
        }

        .ui-button {
            flex-shrink: 0;
        }

        .ui-tooltip {
            width: 100%;
        }


    }

</style>



<!--
    Template
-->

<template>
    <form class="i-search tile" @submit.prevent="submit({ value: query, param: 'search' })">

        <i-input
            :placeholder="placeholder"
            v-model="query"
            @focusout="tooltip = false"
            @focusin="tooltip = true"
        />

        <ui-button icon="lg-search" submit />

        <ui-tooltip :model-value="tooltip" v-if="items.length">
            <ui-item v-for="item in items" :key="item.value" :text="item.text" :total="item.total" @click="submit(item)"/>
        </ui-tooltip>

    </form>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useSSR } from '#app/services/utils.js'



    // -----------------
    // Config
    // -----------------

    const props = defineProps({
        placeholder: String,
        route: String,
        suggestions: {
            required: true,
            type: Array
        }
    })



    // -----------------
    // Data
    // -----------------

    const ssr = useSSR();
    const route = useRoute();
    const router = useRouter();
    const query = ref('');
    const tooltip = ref(false);

    const items = computed(() => {
        if (!query.value) return []
        const search = query.value.toLowerCase();
        const word = new RegExp(`\\b${search}\\b`)
        return props.suggestions.map(item => {
            let score = 0;
            const text = item.text.toLowerCase();
            const full = item.alias ? `${text} ${item.alias.toLowerCase()}` : text;
            if (text === search) score = 3;
            else if (word.test(text)) score = 2;
            else if (full.includes(search)) score = 1;
            return { ...item, score }
        })
        .filter(item => item.score)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    })



    // -----------------
    // Methods
    // -----------------

    function submit ({ value, param }) {
        router.push({ name: props.route, query: { ...route.query, page: 1, [param]: value || undefined } });
        query.value = null;
        document.activeElement?.blur();
    }



</script>