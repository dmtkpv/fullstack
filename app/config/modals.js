import AuthLogin from '#app/routes/auth/auth-login.vue'
import AuthRegister from '#app/routes/auth/auth-register.vue'
import AuthReset from '#app/routes/auth/auth-reset.vue'
import AuthVerify from '#app/routes/auth/auth-verify.vue'
import Alert from '#app/modals/m-alert.vue'
import Confirm from '#app/modals/m-confirm.vue'
import Premium from '#app/modals/m-premium.vue'
import Images from '#app/modals/m-images.vue'
import Message from '#app/modals/m-message.vue'
import Share from '#app/modals/m-share.vue'

export default [
    {
        name: 'auth-login',
        component: AuthLogin
    },
    {
        name: 'auth-register',
        component: AuthRegister
    },
    {
        name: 'auth-reset',
        component: AuthReset
    },
    {
        name: 'auth-verify',
        component: AuthVerify,
        noOutsideClick: true
    },
    {
        name: 'alert',
        component: Alert
    },
    {
        name: 'confirm',
        component: Confirm
    },
    {
        name: 'premium',
        component: Premium
    },
    {
        name: 'images',
        component: Images,
        noOutsideClick: true
    },
    {
        name: 'share',
        component: Share
    },
    {
        name: 'message',
        component: Message
    }
]