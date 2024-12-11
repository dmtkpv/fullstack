<!--
    Styles
-->

<style lang="scss">

    .landing-features {

        section {

            text-align: center;
            display: grid;

            img {
                height: 140px;
                margin: 0 auto;
            }

            h3 {
                margin: 16px 0 8px 0;
            }

            @include lg-md {
                grid-template-columns: repeat(3, 1fr);
            }

            @include lg {
                gap: 64px;
            }

            @include md {
                gap: 32px;
            }

            @include sm {
                gap: 48px;
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-features container-md">

        <landing-heading
            :title="value.title"
            :note="value.note"
        />

        <section>
            <div v-for="column in value.columns">
                <img :src="column.image">
                <h3 class="h4">{{ column.title }}</h3>
                <p>{{ column.note }}</p>
            </div>
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    defineProps([
        'value'
    ])

</script>