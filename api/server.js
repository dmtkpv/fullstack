import { AUTH } from '@vacature/shared/constants.js'
import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import PG from 'pg'
import database from './config/database.js'
import actions from './config/actions.js'
import Content from './routes/route-content.js'
import Auth from './routes/route-auth.js'
import Account from './routes/route-account.js'
import Places from './routes/route-places.js'
import Jobs from './routes/route-jobs.js'
import Views from './routes/route-views.js'
import Stripe from './routes/route-stripe.js'
import Candidates from './routes/route-candidates.js'
import Companies from './routes/route-companies.js'
import Marketing from './routes/route-marketing.js'
import { jwt, Exception, parseError, io } from '#api/index.js'



// -----------------
// Data
// -----------------

const { API_PORT, APP_URL, APP_ALIAS } = process.env;
const aliases = APP_ALIAS ? APP_ALIAS.split(',') : [];
const app = express();
const server = createServer(app);



// -----------------
// PG notifications
// -----------------

const pg = new PG.Client(database.connection);
await pg.connect();
await pg.query('LISTEN main');

pg.on('notification', async ({ payload }) => {
    const { action, ...params } = JSON.parse(payload);
    try { await actions[action]?.(params) }
    catch (e) { console.log(e) }
});



// -----------------
// Web socket
// -----------------

io.attach(server);



// -----------------
// Logs
// -----------------

morgan.token('time', () => {
    return new Date().toLocaleTimeString('en', { hour12: false })
});

app.use(morgan('[:time] :method :url :status', {
    skip: req => req.method === 'OPTIONS'
}));



// -----------------
// Middlewares
// -----------------

app.use(cookieParser());

app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/wLDbs0oeKF') next();
    else express.json()(req, res, next);
});

app.use(cors({
    origin: [APP_URL, ...aliases],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))



// -----------------
// Set locale
// -----------------

app.use((req, res, next) => {
    res.locals.locale = req.acceptsLanguages('nl', 'en') || 'nl';
    next();
});



// -----------------
// Get user & role
// -----------------

app.use((req, res, next) => {
    const auth = req.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return next();
    const token = auth.split(' ').pop();
    try {
        const data = jwt.verify(token);
        Object.assign(res.locals, data);
    }
    catch (e) {
        throw new Exception('UNAUTHORIZED')
    }
    next();
});




// -----------------
// Set routes
// -----------------

app.use('/content', Content)
app.use('/auth', Auth)
app.use('/places', Places)
app.use('/account', Account)
app.use('/jobs', Jobs)
app.use('/views', Views)
app.use('/stripe', Stripe)
app.use('/candidates', Candidates)
app.use('/companies', Companies)
app.use('/marketing', Marketing)



// -----------------
// 404
// -----------------

app.use(() => {
    throw new Exception('NOT_FOUND')
})



// -----------------
// Error handler
// -----------------

app.use(async (err, req, res, next) => {
    console.error(err);
    const { status, code, data } = parseError(err, req);
    if (code === 'UNAUTHORIZED') res.clearCookie(AUTH.cookie);
    res.status(status).json({ error: { code, data }})
})




// -----------------
// Run
// -----------------

server.listen(API_PORT, () => {
    console.log(`http://localhost:${API_PORT}`)
})

