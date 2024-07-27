import Stripe from 'stripe'
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

export const handleInvoicePayment = async (event: any) => {
    try {
        const eventObject = event?.data?.object;

        // const {
        //     customer,
        //     status,
        // } = eventObject;
        
        console.log(eventObject, eventObject.subscription)
    } catch (err) {
        console.error(`Error: /lib/stripe/generateWebhookEvent - ${err}`)
    }
}