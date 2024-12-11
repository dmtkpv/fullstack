import { computed, reactive } from 'vue'

export default ({ t, data }) => [

    {
        inputs: {
            place_id: {
                component: 'i-place',
                options: reactive({
                    placeholder: t('LOCATION_PLACEHOLDER'),
                    text: computed(() => data.location.address)
                })
            }
        }
    },

    {
        inputs: {
            geometry: {
                component: 'ui-map',
            },
        }
    }

]