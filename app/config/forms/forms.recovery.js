export default ({ t }) => [

    {
        label: t('PASSWORD_LABEL'),
        inputs: {
            password: {
                component: 'i-input',
                options: {
                    placeholder: t('PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

    {
        label: t('RE_PASSWORD_LABEL'),
        inputs: {
            re_password: {
                component: 'i-input',
                options: {
                    placeholder: t('RE_PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

]