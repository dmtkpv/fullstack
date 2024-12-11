<!--
    Template
-->

<template>

    <router-link v-if="props.to" :to="to">
        <slot />
    </router-link>

    <a v-else-if="props.href" :href="props.href">
        <slot />
    </a>

    <button v-else-if="attrs.onClick || type" :type="type || 'button'">
        <slot />
    </button>

    <div v-else>
        <slot />
    </div>

</template>



<!--
    Scripts
-->

<script setup>

    import { useAttrs } from 'vue'

    const props = defineProps({
        to: Object,
        href: String,
        type: String,
    })

    const attrs = useAttrs();

</script>