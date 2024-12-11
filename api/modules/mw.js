import { Exception } from '@vacature/shared/errors.js'
import { ROLES } from '@vacature/shared/constants.js'

export default {

    authorized () {
        return function (req, res, next) {
            if (res.locals.user) return next();
            throw new Exception('FORBIDDEN');
        }
    },

    role (...names) {
        return function (req, res, next) {
            const role = names.find(name => ROLES[name] === res.locals.role);
            if (role) return next();
            else throw new Exception('FORBIDDEN');
        }
    },

    use (services) {
        return function (req, res, next) {
            req.services ??= {};
            Object.assign(req.services, services);
            next();
        }
    }

}