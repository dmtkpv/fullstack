import express from 'express'
import Stripe from 'stripe'
import { Exception, controller, joi, mw } from '#api/index.js'



// -----------------
// Data
// -----------------

const { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, STRIPE_TAX_RATE } = process.env;
const stripe = Stripe(STRIPE_SECRET);



// -----------------
// Data
// -----------------

const router = express.Router();




// -----------------
// Upsert
// -----------------

async function upsert (db, data) {

    const company = await db('companies').where('stripe_customer', data.customer).select('id').first();
    if (!company) throw new Error(`Company not found for customer: ${data.customer}`);

    await db('subscriptions').$insert({
        id: data.id,
        company: company.id,
        price: data.items.data[0].plan.id,
        status: data.status,
        canceled: data.cancel_at_period_end,
        expires_at: new Date(data.current_period_end * 1000)
    }).onConflict('id').merge();

}



// -----------------
// Create
// -----------------

router.post('/create', mw.role('company'), controller(async ({ body, company, locale, routes, db }) => {

    const input = joi.check(body, {
        price_id: joi.string().required(),
        cancel_route: joi.string().required().valid('account-plans', 'premium')
    })

    const price = await db('plans_prices').pk(input.price_id).where('active', true);
    if (!price) throw new Exception('INVALID_SUBSCRIPTION');

    const data = await db('companies').pk(company).select('name', 'email', 'stripe_customer');
    if (!data) throw new Exception('INVALID_SUBSCRIPTION');

    const subscriptions = await db('subscriptions').where({ company }).select('status')
    const canceled = subscriptions.every(sub => sub.status === 'canceled');
    if (subscriptions.length && !canceled) throw new Exception('INVALID_SUBSCRIPTION');

    if (!data.stripe_customer) {
        const customer = await stripe.customers.create({ name: data.name, email: data.email });
        await db('companies').where({ id: company }).$update({ stripe_customer: customer.id });
        data.stripe_customer = customer.id;
    }

    const success_url = await routes.resolve('account-plans', { locale, query: { refresh: true }});
    const cancel_url = await routes.resolve(input.cancel_route, { locale });

    const subscription_data = {
        trial_period_days: subscriptions.length ? undefined : 30,
        default_tax_rates: [STRIPE_TAX_RATE]
    }

    const { url } = await stripe.checkout.sessions.create({
        locale,
        success_url,
        cancel_url,
        subscription_data,
        mode: 'subscription',
        customer: data.stripe_customer,
        line_items: [{ price: input.price_id, quantity: 1 }]
    });

    return { url };

}))



// -----------------
// Update
// -----------------

router.post('/update', mw.role('company'), controller(async ({ body, company, locale, routes, db }) => {

    const input = joi.check(body, {
        price_id: joi.string()
    }, { required: false })

    const data = await db('companies').pk(company).select('stripe_customer');
    if (!data?.stripe_customer) throw new Exception('INVALID_SUBSCRIPTION');

    const subscriptions = await db('subscriptions').where({ company }).whereNot('status', 'canceled').select('id');
    if (!subscriptions.length || (subscriptions.length > 1 && input?.price_id)) throw new Exception('INVALID_SUBSCRIPTION');

    let flow_data
    if (input?.price_id) {

        const price = await db('plans_prices').pk(input.price_id).where('active', true);
        if (!price) throw new Exception('INVALID_SUBSCRIPTION');

        const subscription = await stripe.subscriptions.retrieve(subscriptions[0].id);
        if (input.price_id === subscription.items.data[0].price.id) throw new Exception('INVALID_SUBSCRIPTION');

        flow_data = {
            type: 'subscription_update_confirm',
            subscription_update_confirm: {
                subscription: subscription.id,
                items: [{
                    id: subscription.items.data[0].id,
                    quantity: 1,
                    price: input.price_id,
                }]
            }
        }
    }

    const return_url = await routes.resolve('account-plans', { locale, query: { refresh: true }});

    const { url } = await stripe.billingPortal.sessions.create({
        locale,
        return_url,
        flow_data,
        customer: data.stripe_customer
    });

    return { url }

}))



// -----------------
// Create Success
// -----------------

router.post('/refresh', mw.role('company'), controller(async ({ company, db }) => {
    
    const { stripe_customer } = await db('companies').pk(company).select('stripe_customer');

    const subscriptions = await stripe.subscriptions.list({
        customer: stripe_customer,
        status: 'all',
        limit: 100
    });

    for (const subscription of subscriptions.data) {
        await upsert(db, subscription);
    }

    const v_plan = await db('v_plans').where({ company }).select('value').first();
    const plan = v_plan?.value ?? null;
    return { plan }

}))



// -----------------
// Webhook
// -----------------

router.post('/wLDbs0oeKF', express.raw({ type: 'application/json' }), controller(async ({ headers, body, db }) => {

    const events = [
        'customer.subscription.created',
        'customer.subscription.deleted',
        'customer.subscription.paused',
        'customer.subscription.resumed',
        'customer.subscription.updated'
    ]

    try {
        const sig = headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
        if (events.includes(event.type)) await upsert(db, event.data.object);
    }

    catch (error) {
        throw new Exception('INTERNAL_SERVER_ERROR', {
            message: error.message || 'An unexpected error occurred.',
            stack: error.stack
        })
    }

}))



// -----------------
// Exports
// -----------------

export default router;