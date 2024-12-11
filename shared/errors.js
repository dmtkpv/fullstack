// -----------------
// Error codes
// -----------------

const JOI_ERRORS = [
    'object.unknown',
    'object.base',
    'any.unknown',
    'any.required',
    'any.only',
    'array.base',
    'array.min',
    'string.base',
    'string.email',
    'string.password',
    'string.re_password', // Passwords do not match
    'string.empty',
    'string.website',
    'string.facebook',
    'string.guid',
    'string.min',
    'number.base',
    'number.integer',
    'number.max',
    'number.min',
    'number.natural',
    'number.greater', // {{label}} must be greater than {{limit}}'
    'boolean.base'
]

const API_ERRORS = [
    'INTERNAL_SERVER_ERROR',
    'UNAUTHORIZED',
    'UNVERIFIED',
    'UNPAID',
    'FORBIDDEN',
    'NOT_FOUND',
    'NO_PAYLOAD',
    'NO_ROUTE_PARAM',
    'NO_REFERENCE',
    'DUPLICATE_ENTRY',
    'DUPLICATE_EMAIL',
    'EXPIRED_TOKEN',
    'INVALID_TOKEN',
    'INVALID_LOGIN',
    'INVALID_LIST_ITEM',
    'INVALID_FILE',
    'INVALID_FILE_TYPE',
    'INVALID_FILE_SIZE',
    'INVALID_FILES_NUMBER',
    'INVALID_PASSWORD',
    'INVALID_LOCATION',
    'INVALID_SUBSCRIPTION',
    'INVALID_VERIFICATION_CODE',
    'INVALID_MESSAGE',
    'FAILED_EMAIL',
    'MESSAGES_LIMIT',
    'ARCHIVED_LOGIN',
    'ARCHIVED_REGISTER'
]

const ERRORS = [
    ...JOI_ERRORS,
    ...API_ERRORS
]



// -------------------
// Exception
// -------------------

export class Exception extends Error {
    constructor (code, data) {
        super(code);
        this.code = code;
        this.data = data;
    }
}



// -----------------
// Error helpers
// -----------------

export function getErrorCode ({ code, name, type }, { path }) {
    if (type === 'MailgunAPIError') return 'FAILED_EMAIL'
    if (name === 'TokenExpiredError') return 'EXPIRED_TOKEN';
    if (name === 'JsonWebTokenError') return 'INVALID_TOKEN';
    if (code === '23505') return 'DUPLICATE_ENTRY';
    if (code === '23503') return 'NO_REFERENCE';
    if (ERRORS.includes(code)) return code;
    return 'INTERNAL_SERVER_ERROR'
}

export function getErrorStatus ({ code }, { method }) {
    if (code === 'UNAUTHORIZED') return 401;
    if (code === 'UNPAID') return 402;
    if (code === 'FORBIDDEN') return 403;
    if (code === 'NOT_FOUND') return 404;
    if (!JOI_ERRORS.includes(code)) return 500;
    if (method === 'POST' || method === 'PATCH') return 400;
    return 422;
}



// -----------------
// Exports
// -----------------

export function parseError (err, req) {
    err.code = getErrorCode(err, req);
    err.status = getErrorStatus(err, req);
    return err;
}