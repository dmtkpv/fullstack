import { reactive, computed } from 'vue'

export default ({ data, t }) => reactive([

    {
        half: true,
        label: t('FIRST_NAME_LABEL'),
        hidden: data.member.id,
        inputs: {
            first_name: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('FIRST_NAME_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('LAST_NAME_LABEL'),
        hidden: data.member.id,
        inputs: {
            last_name: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('LAST_NAME_PLACEHOLDER'),
                }
            }
        }
    },

    {
        label: t('EMAIL_LABEL'),
        hidden: data.member.id,
        inputs: {
            email: {
                component: 'i-input',
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER'),
                }
            }
        }
    },

    {
        label: t('LOCATIONS_LABEL'),
        hidden: computed(() => {
            return !data.locations.length
        }),
        inputs: {
            locations: {
                component: 'i-checkboxes',
                options: {
                    field: 'location',
                    list: computed(() => {
                        return data.locations.map(item => ({
                            value: item.id,
                            text: item.address
                        }))
                    })
                }
            }
        }
    },

    {
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            place_id: {
                component: 'i-place',
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER'),
                }
            }
        }
    },

    {
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            geometry: {
                component: 'ui-map'
            }
        }
    },

])