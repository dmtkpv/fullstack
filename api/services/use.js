import { defaults } from 'lodash-es'
import knex from '#api/modules/knex.js'
import useAuth from './use-auth.js'
import useFiles from './use-files.js'
import useMails from './use-mails.js'
import useRooms from './use-rooms.js'
import usePlaces from './use-places.js'
import useRoutes from './use-routes.js'

const services = {
    files: useFiles,
    places: usePlaces,
    routes: useRoutes,
    mails: useMails,
    auth: useAuth,
    rooms: useRooms
}

export default function (ctx, cb) {

    ctx.services ??= {};
    Object.assign(ctx.services, services);
    defaults(ctx, knex.client.userParams);

    return knex.withUserParams(ctx).transaction(async db => {
        ctx.db = db;
        const used = {};
        return cb(new Proxy(ctx, {
            get (ctx, key, proxy) {
                if (!ctx.services[key]) return ctx[key];
                if (!used[key]) used[key] = ctx.services[key](proxy);
                return used[key];
            }
        }));
    })
}


