import apply from './forms/forms.apply.js'
import auth from './forms/forms.auth.js'
import candidates from './forms/forms.candidates.js'
import company from './forms/forms.company.js'
import job from './forms/forms.job.js'
import jobs from './forms/forms.jobs.js'
import location from './forms/forms.location.js'
import member from './forms/forms.member.js'
import message from './forms/forms.message.js'
import password from './forms/forms.password.js'
import recovery from './forms/forms.recovery.js'
import profile from './forms/forms.profile.js'

export default {
    apply,
    candidates,
    company,
    job,
    jobs,
    location,
    member,
    message,
    password,
    profile,
    recovery,
    ...auth
}