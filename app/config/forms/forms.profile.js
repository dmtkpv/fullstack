export default ({ t, user, data, lists }) => [

    {
        inputs: {
            avatar: {
                component: 'i-image',
                options: {
                    endpoint: 'account-profile-image',
                    default: 'user',
                    button: t('IMAGE_BUTTON'),
                    onSuccess: id => user.avatar = id
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('FIRST_NAME_LABEL'),
        inputs: {
            first_name: {
                component: 'i-input',
                options: {
                    placeholder: t('FIRST_NAME_PLACEHOLDER'),
                    type: 'text'
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('LAST_NAME_LABEL'),
        inputs: {
            last_name: {
                component: 'i-input',
                options: {
                    placeholder: t('LAST_NAME_PLACEHOLDER'),
                    type: 'text'
                }
            }
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
                    placeholder: t('EMAIL_PLACEHOLDER'),
                    type: 'email'
                }
            }
        }
    },

    {
        half: true,
        label: t('PHONE_LABEL'),
        inputs: {
            phone: {
                component: 'i-input',
                options: {
                    placeholder: t('PHONE_PLACEHOLDER'),
                    type: 'number'
                }
            }
        }
    },

    {
        half: true,
        label: t('GENDER_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            gender: {
                component: 'i-select',
                options: {
                    list: lists.genders,
                    placeholder: t('GENDER_PLACEHOLDER'),
                }
            }
        },
    },

    {
        half: true,
        label: t('EDUCATION_FIELD_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            education_field: {
                component: 'i-select',
                options: {
                    searchable: true,
                    list: lists.education_fields,
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_LEVEL_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            education_level: {
                component: 'i-select',
                options: {
                    list: lists.education_levels,
                    placeholder: t('EDUCATION_LEVEL_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('LANGUAGES_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            languages: {
                component: 'i-tags',
                options: {
                    placeholder: t('LANGUAGES_PLACEHOLDER'),
                    list: lists.languages,
                }
            }
        },
    },

    {
        label: t('CV_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            cv: {
                component: 'i-file',
                options: {
                    placeholder:  t('CV_PLACEHOLDER'),
                    note: t('CV_NOTE'),
                    button: t('CV_BUTTON'),
                    type: 'cvs',
                    uploadApi: 'account-cvs-create',
                    list: data.cvs
                }
            }
        },
    }


]