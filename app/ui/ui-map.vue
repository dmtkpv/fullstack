<!--
    Styles
-->

<style lang="scss">

    .ui-map {
        height: 400px;
        overflow: hidden;
        border-radius: $radius;
        background: $bg;

        .gm-style iframe + div {
            border:none !important;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-map" ref="$el" />
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, onMounted, watch } from 'vue'



    // -------------------
    // Data
    // -------------------

    const props = defineProps([
        'modelValue'
    ])

    const defaults = {
        center: { lat: 52.3676, lng: 4.9041 },
        zoom: 12,
        mapTypeControl: false,
    }

    const mapId = Math.random() + '';
    const $el = ref(null);



    // -------------------
    // Loader
    // -------------------

    function load () {
        return new Promise(resolve => {

            const src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap&loading=async&libraries=marker`
            let script = document.head.querySelector(`script[src='${src}']`);

            if (script) {
                if (window.google) resolve();
                else window.initMap = resolve;
            }

            else {
                script = document.createElement('script');
                script.src = src;
                document.head.appendChild(script);
                window.initMap = resolve;
            }
        })


    }



    // -------------------
    // Mount
    // -------------------

    onMounted(async () => {

        await load();
        const map = new google.maps.Map($el.value, { mapId, ...defaults });

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: defaults.center,
            map: null
        });

        watch(() => props.modelValue, value => {
            if (!value) return marker.setMap(null);
            marker.setMap(map);
            marker.position = value;
            map.setCenter(value);
        }, { immediate: true })

    })



</script>