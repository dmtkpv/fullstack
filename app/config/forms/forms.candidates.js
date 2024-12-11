export default ({ t, filters }) => [

    {
        label: t('EDUCATION_FIELD_LABEL'),
        inputs: {
            education_field: {
                component: 'i-select',
                options: {
                    searchable: true,
                    list: filters.education_fields,
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                    clear: t('EDUCATION_FIELD_CLEAR')
                }
            }
        }
    },

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
        label: t('GENDER_LABEL'),
        inputs: {
            gender: {
                component: 'i-radios',
                options: {
                    list: filters.genders
                }
            }
        }
    }

]