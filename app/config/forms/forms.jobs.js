import { reactive, computed } from 'vue'

export default ({ HOURS, t, data, filters }) => reactive([

    {
        label: t('LOCATION_LABEL'),
        inputs: {
            location: {
                component: 'i-place',
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER'),
                    text: computed(() => data.place.name),
                    types: ['(cities)']
                },
                events: {
                    text (value) {
                        data.place.name = value
                    }
                }
            }
        }
    },

    {
        label: t('DISTANCE_LABEL'),
        hidden: computed(() => !data.query.location),
        inputs: {
            distance: {
                component: 'i-slider',
                options: {
                    min: 5,
                    max: 50
                }
            }
        }
    },

    {
        label: t('BRANCH_LABEL'),
        inputs: {
            branch: {
                component: 'i-select',
                options: {
                    list: filters.branches,
                    searchable: true,
                    icon: 'lg-category',
                    placeholder: t('BRANCH_PLACEHOLDER'),
                    clear: t('BRANCH_CLEAR')
                }
            }
        }
    },

    {
        label: t('EDUCATION_FIELD_LABEL'),
        inputs: {
            education_field: {
                component: 'i-select',
                options: {
                    list: filters.education_fields,
                    searchable: true,
                    icon: 'lg-education',
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                    clear: t('EDUCATION_FIELD_CLEAR')
                }
            }
        }
    },

    // {
    //     label: t('TYPE_LABEL'),
    //     inputs: {
    //         type: {
    //             component: 'i-checkboxes',
    //             options: {
    //                 list: 'job_types'
    //             }
    //         }
    //     }
    // },

    {
        label: t('EDUCATION_LEVEL_LABEL'),
        inputs: {
            education_level: {
                component: 'i-radios',
                options: {
                    list: filters.education_levels
                }
            }
        }
    },

    {
        label: t('EDUCATION_PATH_LABEL'),
        inputs: {
            education_path: {
                component: 'i-radios',
                options: {
                    list: filters.education_paths
                }
            }
        }
    },

    {
        label: t('DATE_LABEL'),
        inputs: {
            hour: {
                component: 'i-radios',
                options: {
                    list: HOURS.map(value => ({ value, text: t(`HOURS_${value}`) }))
                }
            }
        }
    }

])