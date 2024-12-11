import { Exception } from '@vacature/shared/errors.js'
import use from '#api/services/use.js'

export default function controller (fn) {
    return async function (req, res, next) {
        try {

            const { params, query, body, headers, services } = req;
            const ctx = { res, req, params, query, body, headers, services, ...res.locals };
            const data = await use(ctx, fn);

            if (req.method === 'DELETE') {
                if (!data) throw new Exception('NOT_FOUND');
                else return res.send(null);
            }

            if (req.method === 'PATCH') {
                if (!data) throw new Exception('NOT_FOUND');
                else return res.send(null);
            }

            if (req.method === 'GET') {
                if (data == null) throw new Exception('NOT_FOUND')
            }

            if (req.method === 'POST') {
                if (data == null) return res.send(null);
            }

            res.json({ data });

        }
        catch (err) {
            next(err);
        }
    }
}