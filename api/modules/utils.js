import crypto from 'crypto'
import JWT from 'jsonwebtoken';
import joi from './joi.js'



// -----------------
// Rules
// -----------------

export const rules = {
    id: joi.number().natural().required(),
    uuid: joi.string().guid().required()
}



// -----------------
// Schemas
// -----------------

export const schemas = {

    pager: {
        page: joi.number().natural().default(1),
        limit: joi.number().natural().max(100).default(10)
    },

    id: {
        id: rules.id
    },

    uuid: {
        id: rules.uuid
    }

}



// -----------------
// MD5
// -----------------

export const md5 = {

    hash (string) {
        return crypto.createHash('md5').update(string).digest('hex')
    },

    verify (hash, string) {
        return hash === this.hash(string);
    }

}



// -----------------
// JWT
// -----------------

const { API_SECRET } = process.env;

export const jwt = {

    sign (payload, expiresIn) {
        return JWT.sign(payload, API_SECRET, { expiresIn });
    },

    verify (token, options) {
        return JWT.verify(token, API_SECRET, options);
    }

}