export default ({ t }) => [

    {
        label: t('MESSAGE_LABEL'),
        inputs: {
            message: {
                component: 'i-text',
                options: {
                    placeholder: t('MESSAGE_PLACEHOLDER')
                }
            }
        }
    }

]