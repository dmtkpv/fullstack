import { computed, reactive } from 'vue'

function component (component, options) {
    return { component, options }
}

export default {



    // -----------------
    // Login
    // -----------------

    login: ({ t, restore }) => [

        {
            label: t('EMAIL_LABEL'),
            inputs: {
                email: {
                    component: 'i-input',
                    options: {
                        type: 'email',
                        placeholder: t('EMAIL_PLACEHOLDER')
                    }
                }
            }
        },

        {
            label: t('PASSWORD_LABEL'),
            inputs: {
                password: {
                    component: 'i-input',
                    options: {
                        type: 'password',
                        placeholder: t('PASSWORD_PLACEHOLDER')
                    }
                }
            },
            note: {
                title: t('RESET_PASSWORD'),
                onClick: restore
            }
        }

    ],



    // -----------------
    // Register
    // -----------------

    register: ({ t, user }) => reactive([

        {
            label: t('COMPANY_LABEL'),
            hidden: computed(() => user.role === 'candidate'),
            inputs: {
                company: {
                    component: 'i-input',
                    options: {
                        type: 'text',
                        placeholder: t('COMPANY_PLACEHOLDER')
                    }
                }
            }
        },

        {
            half: true,
            label: t('FIRST_NAME_LABEL'),
            inputs: {
                first_name: {
                    component: 'i-input',
                    options: {
                        type: 'text',
                        placeholder: t('FIRST_NAME_PLACEHOLDER')
                    }
                }
            }
        },

        {
            half: true,
            label: t('LAST_NAME_LABEL'),
            inputs: {
                last_name: {
                    component: 'i-input',
                    options: {
                        type: 'text',
                        placeholder: t('LAST_NAME_PLACEHOLDER')
                    }
                }
            }
        },

        {
            label: t('EMAIL_LABEL'),
            inputs: {
                email: {
                    component: 'i-input',
                    options: {
                        type: 'email',
                        placeholder: t('EMAIL_PLACEHOLDER')
                    }
                }
            }
        },

        {
            label: t('PASSWORD_LABEL'),
            inputs: {
                password: {
                    component: 'i-input',
                    options: {
                        type: 'password',
                        placeholder: t('PASSWORD_PLACEHOLDER')
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
                        type: 'password',
                        placeholder: t('RE_PASSWORD_PLACEHOLDER')
                    }
                }
            }
        }

    ]),



    // -----------------
    // Restore
    // -----------------

    restore: ({ t }) => [

        {
            label: t('EMAIL_LABEL'),
            inputs: {
                email: {
                    component: 'i-input',
                    options: {
                        type: 'email',
                        placeholder: t('EMAIL_PLACEHOLDER')
                    }
                }
            }
        }

    ],



    // -----------------
    // Verify
    // -----------------

    verify: ({ t }) => [

        {
            label: t('CODE_LABEL'),
            inputs: {
                code: {
                    component: 'i-input',
                    options: {
                        type: 'number',
                        placeholder: t('CODE_PLACEHOLDER')
                    }
                }
            }
        }

    ],


}