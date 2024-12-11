<!--
    Styles
-->

<style lang="scss">

    .ui-pager {

        display: flex;
        justify-content: center;
        margin-top: $padding-y;
        gap: 4px;
        user-select: none;

        a {

            min-width: 32px;
            height: 32px;
            padding: 0 4px;

            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: $radius;
            color: $blue;

            svg {
                width: 12px;
                height: 12px;
            }

            &:hover {
                background: $blue-light;
            }

            &._active {
                background: $blue;
                color: $white;
            }

            &._disabled {
                color: $grey;
                pointer-events: none;
            }

        }


    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-pager" v-if="valid && max > 1">

        <a :class="{ _disabled: page === min }" @click="update(page - 1)">
            <ui-icon value="sm-prev" />
        </a>

        <a v-for="item in range" :key="item" :class="{ _active: item === page, _disabled: item === '...' }" @click="update(item)">
            {{ item }}
        </a>

        <a :class="{ _disabled: page === max }" @click="update(page + 1)">
            <ui-icon value="sm-next" />
        </a>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'



    // ------------------
    // Data
    // ------------------

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps([
        'limit',
        'total',
        'modelValue'
    ])

    const min = ref(1);
    const max = computed(() => Math.ceil(props.total / props.limit))
    const page = computed(() => props.modelValue ?? 1);
    const valid = computed(() => page.value >= min.value && page.value <= max.value);



    // ------------------
    // Range
    // ------------------

    const range = computed(() => {

        const range = []
        const count = Math.min(max.value, 7);
        const iMin = Math.min(Math.max(page.value - 3, 1), max.value - count + 1)
        const iMax = iMin + count - 1;

        for (let i = iMin; i <= iMax; i++) {
            if (i === iMin) range.push(min.value);
            else if (i === iMin + 1 && i > min.value + 1) range.push('...');
            else if (i === iMax - 1 && i < max.value - 1) range.push('...');
            else if (i === iMax) range.push(max.value);
            else range.push(i);
        }

        return range

    })



    // ------------------
    // Actions
    // ------------------

    function update (value) {
        emit('update:modelValue', value === min.value ? undefined : value)
    }



</script>