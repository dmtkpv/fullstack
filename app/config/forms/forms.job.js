import { computed, reactive } from 'vue'
import { MBO } from '@vacature/shared/constants.js'

export default ({ t, data, edits, user, lists }) => reactive([

    {
        half: true,
        required: true,
        label: t('TITLE_LABEL'),
        inputs: {
            title: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('TITLE_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('STATUS_LABEL'),
        inputs: {
            publish: {
                component: 'i-checkbox',
                options: {
                    label: t('STATUS_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('PREMIUM_LABEL'),
        inputs: {
            premium: {
                component: 'i-checkbox',
                options: {
                    disabled: user.plan === 3,
                    label: t('PREMIUM_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('URGENT_LABEL'),
        inputs: {
            urgent: {
                component: 'i-checkbox',
                options: {
                    label: t('URGENT_PLACEHOLDER'),
                }
            }
        }
    },

    {
        required: true,
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return !data.locations.length
        }),
        inputs: {
            location: {
                component: 'i-select',
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER'),
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
        required: true,
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            place_id: {
                component: 'i-place',
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER')
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

    {
        required: true,
        label: t('CONTENT_LABEL'),
        inputs: {
            content: {
                component: 'i-wysiwyg'
            }
        }
    },

    // {
    //     half: true,
    //     label: t('TYPE_LABEL'),
    //     inputs: {
    //         type: {
    //             component: 'i-select',
    //             options: {
    //                 list: 'job_types',
    //                 placeholder: t('TYPE_PLACEHOLDER')
    //             }
    //         }
    //     }
    // },

    {
        half: true,
        label: t('CATEGORIES_LABEL'),
        inputs: {
            categories: {
                component: 'i-tags',
                options: {
                    list: lists.categories,
                    placeholder: t('CATEGORIES_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_FIELDS_LABEL'),
        inputs: {
            education_fields: {
                component: 'i-tags',
                options: {
                    list: lists.education_fields,
                    placeholder: t('EDUCATION_FIELDS_PLACEHOLDER')
                }
            }
        }
    },

    //{
    //    half: true,
    //    label: t('EXPERIENCE_LABEL'),
    //    inputs: {
    //        experience: {
    //            component: 'i-input',
    //            options: {
    //                type: 'number',
    //                placeholder: t('EXPERIENCE_PLACEHOLDER')
    //            }
    //        }
    //    }
    //},

    {
        half: true,
        label: t('EDUCATION_LEVELS_LABEL'),
        inputs: {
            education_levels: {
                component: 'i-tags',
                options: {
                    list: lists.education_levels,
                    placeholder: t('EDUCATION_LEVELS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_PATHS_LABEL'),
        hidden: computed(() => {
            const levels = edits.education_levels || data.job.education_levels || [];
            return !levels.some(value => MBO.includes(value))
        }),
        inputs: {
            education_paths: {
                component: 'i-tags',
                options: {
                    list: lists.education_paths,
                    placeholder: t('EDUCATION_PATHS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('RECRUITMENTS_LABEL'),
        inputs: {
            recruitments: {
                component: 'i-input',
                options: {
                    type: 'number',
                    placeholder: t('RECRUITMENTS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('HOURS_LABEL'),
        inputs: {
            hours: {
                component: 'i-input',
                options: {
                    type: 'number',
                    placeholder: t('HOURS_PLACEHOLDER')
                }
            },
            hours_frequency: {
                component: 'i-select',
                options: {
                    list: lists.hours_frequencies,
                    placeholder: t('HOURS_FREQUENCY_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('SALARY_LABEL'),
        inputs: {
            salary_min: {
                component: 'i-input',
                options: {
                    type: 'number',
                    placeholder: t('SALARY_MIN_PLACEHOLDER')
                }
            },
            salary_max: {
                component: 'i-input',
                options: {
                    type: 'number',
                    placeholder: t('SALARY_MAX_PLACEHOLDER')
                }
            },
            salary_frequency: {
                component: 'i-select',
                options: {
                    list: lists.salary_frequencies,
                    placeholder: t('SALARY_FREQUENCY_PLACEHOLDER')
                }
            }
        }
    },
    
    {
        half: true,
        label: t('EXTERNAL_LABEL'),
        inputs: {
            external: {
                component: 'i-checkbox',
                options: {
                    label: t('EXTERNAL_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('URL_LABEL'),
        hidden: computed(() => !(data.job.external || edits.external)),
        inputs: {
            url: {
                component: 'i-input',
                options: {
                    placeholder: t('URL_PLACEHOLDER'),
                    type: 'text'
                }
            }
        }
    },

    {
        label: t('IMAGES_LABEL'),
        inputs: {
            images: {
                component: 'i-files',
                options: {
                    list: computed(() => data.images),
                    type: 'jobs',
                    button: t('IMAGES_BUTTON'),
                    note: t('IMAGES_NOTE'),
                    unit: {
                        apiUpload: 'account-job-images-create',
                        apiParams: computed(() => data.id)
                    }
                }
            }
        }
    },


])