export default ({ t, lists }) => [

    {
        inputs: {
            image: {
                component: 'i-image',
                options: {
                    endpoint: 'account-company-image',
                    default: 'company',
                    button: t('IMAGE_BUTTON')
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('NAME_LABEL'),
        inputs: {
            name: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('NAME_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        required: true,
        label: t('EMAIL_LABEL'),
        inputs: {
            email: {
                component: 'i-input',
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER'),
                }
            },
        }
    },

    {
        half: true,
        label: t('PHONE_LABEL'),
        inputs: {
            phone: {
                component: 'i-input',
                options: {
                    type: 'number',
                    placeholder: t('PHONE_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('WEBSITE_LABEL'),
        inputs: {
            website: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('WEBSITE_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        label: t('FACEBOOK_LABEL'),
        inputs: {
            facebook: {
                component: 'i-input',
                options: {
                    type: 'text',
                    placeholder: t('FACEBOOK_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        label: t('BRANCHES_LABEL'),
        inputs: {
            branches: {
                component: 'i-tags',
                options: {
                    list: lists.branches,
                    placeholder: t('BRANCHES_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('ABOUT_LABEL'),
        inputs: {
            about: {
                component: 'i-wysiwyg'
            }
        }
    },

    {
        label: t('RECOGNIZED_LABEL'),
        inputs: {
            recognized: {
                component: 'i-checkbox',
                options: {
                    label: t('RECOGNIZED_PLACEHOLDER'),
                }
            }
        },
        note: {
            title: t('RECOGNIZED_NOTE')
        }
    },

]
