export default ({ t }) => [

    {
        label: t('CURRENT_PASSWORD_LABEL'),
        inputs: {
            old_password: {
                component: 'i-input',
                options: {
                    placeholder: t('CURRENT_PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

    {
        label: t('NEW_PASSWORD_LABEL'),
        inputs: {
            new_password: {
                component: 'i-input',
                options: {
                    placeholder: t('NEW_PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

    {
        label: t('REPEAT_PASSWORD_LABEL'),
        inputs: {
            re_password: {
                component: 'i-input',
                options: {
                    placeholder: t('REPEAT_PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

]