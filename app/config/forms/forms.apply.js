export default ({ t, data }) => [

    {
        label: t('CV_LABEL'),
        inputs: {
            attachment: {
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
    },

    {
        label: t('MESSAGE_LABEL'),
        required: true,
        inputs: {
            message: {
                component: 'i-text',
                options: {
                    placeholder: t('MESSAGE_PLACEHOLDER')
                }
            }
        }
    },

]