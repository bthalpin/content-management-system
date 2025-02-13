import Stripe from 'stripe'
import { updateUser, findUserByCustomerId } from './user';
import { createSubscription } from './subscription';
import { createTransaction } from './transaction';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export const createCustomer = async (name: string, email: string) => {
    try {
        const customer = await stripe.customers.create({
            name,
            email,
        });
        return customer

    } catch (err) {
        console.error(`Error: /lib/stripe/createCustomer - ${err}`)
    }
}

export const createCheckout = async (user: User, url: string, customer: string) => {
    try {
        const session = await stripe.checkout.sessions.create({
            success_url: `${url}/confirmation?success=true`,
            cancel_url: `${url}`,
            customer,
            line_items: [
            {
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1,
            },
            ],
            mode: 'subscription',
            metadata: {
                user_id: user.user_id
            }
        });

        return session
    } catch (err) {
        console.error(`Error: /lib/stripe/createCheckout - ${err}`)
    }
}

export const generateWebhookEvent = async (payload: string, signature: string) => {
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret!);
        
        return event
    } catch (err) {
        console.error(`Error: /lib/stripe/generateWebhookEvent - ${err}`)
    }
}

export const handleInvoicePayment = async (event: Stripe.InvoicePaymentSucceededEvent) => {
    try {
        const eventObject = event?.data?.object;

        const customer = eventObject.customer as string;
        const status = eventObject.status as string;
        const subscription = eventObject.subscription  as string;
        const charge = eventObject.charge  as string;
        const hosted_invoice_url = eventObject.hosted_invoice_url  as string;
        const period_start = eventObject.period_start
        const period_end = eventObject.period_end
        const endDate = new Date(new Date(period_start * 1000).setFullYear(new Date(period_start * 1000).getFullYear() + 1))
        
        if (!customer) {
            return 
        }

        const user = await findUserByCustomerId(customer)
        
        if (!user) {
            return
        }
        await updateUser({
            is_pending: false
        }, user.user_id)
        
        const newSubscription = await createSubscription({
            stripe_subscription_id: subscription,
            user_id: user.user_id,
            status,
            last_billing_date: new Date(period_start * 1000),
            next_billing_date: endDate
        })

        await createTransaction({
            stripe_charge_id: charge,
            subscription_id: newSubscription?.subscription_id,
            payment_date: new Date(period_start * 1000),
            status,
            invoice_link: hosted_invoice_url
        })
        
    } catch (err) {
        console.error(`Error: /lib/stripe/generateWebhookEvent - ${err}`)
    }
}