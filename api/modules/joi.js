import Joi from 'joi'
import he from 'he'
import isUrl from 'is-url-http'
import sanitizeHtml from 'sanitize-html'
import { isEmpty } from 'lodash-es'
import { Exception } from '@vacature/shared/errors.js'



// -------------------
// String extension
// -------------------

function string (joi) {
    return {
        type: 'string',
        base: joi.string(),
        rules: {

            password: {
                validate (value, helpers) {
                    const upper = /[A-Z]/.test(value);
                    const lower = /[a-z]/.test(value);
                    const number = /\d/.test(value);
                    const length = value.length > 7;
                    if (upper && lower && number && length) return value;
                    return helpers.error('string.password');
                },
            },

            re_password: {
                method (password) {
                    return this.$_addRule({ name: 're_password', args: { password } });
                },
                args: [{
                    name: 'password',
                    ref: true,
                    assert: joi.any()
                }],
                validate (value, helpers, args) {
                    if (value === args.password) return value;
                    return helpers.error('string.re_password');
                },
            },

            website: {
                validate (value, helpers) {
                    if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
                    if (isUrl(value)) return value;
                    return helpers.error('string.website');
                },
            },

            facebook: {
                validate (value, helpers) {
                    if (/^(https?:\/\/)?(www\.)?facebook.com\/.*/i.test(value)) return value;
                    return helpers.error('string.facebook');
                },
            },

            html: {
                validate (value) {
                    value = value.replace(/(<br\s*\/?>\s*){3,}/, '<br></br>')
                    return sanitizeHtml(value, {
                        allowedTags: ['br', 'p', 'strong', 'em', 's', 'ol', 'li', 'ul'],
                        allowedAttributes: {},
                        exclusiveFilter (frame) {
                            return frame.tag !== 'br' && !frame.text.trim();
                        }
                    });
                }
            },

            msg: {
                validate (value) {
                    return he.encode(value).replace(/\n{3,}/g, '\n\n').replace(/\n/g, '<br>')
                }
            }

        }
    }
}



// -------------------
// Number extension
// -------------------

function number (joi) {
    return {
        type: 'number',
        base: joi.number(),
        rules: {

            natural: {
                validate (value, helpers) {
                    if (Number.isInteger(value) && value > 0) return value;
                    return helpers.error('number.natural');
                },
            }

        }
    }
}



// -------------------
// Joi instance
// -------------------

const joi = Joi.extend(string).extend(number);

function onError (details) {
    const { code, local, state } = details[0];
    Object.keys(local).forEach(key => {
        if (joi.isRef(local[key])) local[key] = state.ancestors[0][local[key].path[0]]
    })
    return new Exception(code, local);
}

function check (data, validations, { unknown = false, required = true } = {}) {
    let schema = joi.object(validations);
    if (unknown) schema = schema.unknown(true);
    if (required && isEmpty(data)) throw new Exception('NO_PAYLOAD')
    const { error, value } = schema.error(onError).validate(data)
    if (error) throw error;
    return value;
}

export default Object.assign(joi, {
    check
})