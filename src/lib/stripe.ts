import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


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