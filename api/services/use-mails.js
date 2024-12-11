import path from 'path'
import fs from 'fs'
import Mustache from 'mustache'
import mailgun from 'nodemailer-mailgun-transport';
import { createTransport } from 'nodemailer'
import { joi } from '#api/index.js'

const { APP_URL, ADMIN_URL, EMAIL_FROM, EMAIL_REPLY_TO, MAILGUN_HOST, MAILGUN_KEY, MAILGUN_DOMAIN, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
const filepath = path.resolve('./templates/email.mustache');
const file = fs.readFileSync(filepath, 'utf8');

const mg = createTransport(mailgun({
    host: MAILGUN_HOST,
    auth: {
        api_key: MAILGUN_KEY,
        domain: MAILGUN_DOMAIN
    }
}));

const smtp = createTransport( {
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    },
});

export default function ({ db, routes, ...ctx }) {



    // -----------------
    // Send
    // -----------------

    async function send (key, options) {

        const { to, cc, data, reply_to, locale } = joi.check(options, {
            to: joi.string().email().required(),
            cc: joi.array(),
            data: joi.object().required(),
            reply_to: joi.string().email(),
            locale: joi.string().valid('en', 'nl').default(ctx.locale)
        })

        const template = await db('templates').where({ key }).first().select([
            'subject',
            'body',
            'button',
            'route',
            'route_options'
        ])

        const settings = await db('directus_settings').first().select([
            'email_default_name',
            'email_greeting',
            'email_signature',
            'email_footer',
            'email_logo',
            'project_name'
        ]);

        Object.assign(data, {
            project_name: settings.project_name,
            email_logo: settings.email_logo
        })

        const translations = await db('translations').select('id', locale).whereIn('id', [
            template.subject,
            template.body,
            template.button,
            settings.email_greeting,
            settings.email_signature,
            settings.email_footer,
            settings.email_default_name,
        ])

        if (!data.name) {
            data.name = translate(settings.email_default_name)
        }

        const params = {
            APP_URL,
            ADMIN_URL,
            subject: render(template.subject),
            body: render(template.body),
            email_greeting: render(settings.email_greeting),
            email_signature: render(settings.email_signature),
            email_footer: render(settings.email_footer),
            email_logo: settings.email_logo,
            project_name: settings.project_name,
            message: data.message,
            headline: data.headline,
        }

        if (template.button) {
            const route_options = Mustache.render(template.route_options, data);
            params.button_url = await routes.resolve(template.route, { locale, ...JSON.parse(route_options) });
            params.button = render(template.button);
        }

        function translate (id) {
            return translations.find(translation => translation.id === id)[locale];
        }

        function render (id) {
            return Mustache.render(translate(id), data);
        }

        const from = `${params.project_name} <${EMAIL_FROM}>`;
        const html = Mustache.render(file, params);

        const mail = {
            from, to, html,
            cc: cc?.filter(email => email !== to),
            subject: params.subject,
            replyTo: reply_to ?? EMAIL_REPLY_TO
        }

        await mg.sendMail(mail).catch(e => {
            console.log(e);
            return smtp.sendMail(mail);
        })


    }



    // -----------------
    // Exports
    // -----------------

    return {
        send
    }

}



