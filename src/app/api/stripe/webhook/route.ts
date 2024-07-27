import { createCheckout, createCustomer, generateWebhookEvent, handleInvoicePayment } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export async function POST(request: NextRequest) {
    try {
        console.log(endpointSecret, 'ARRIVED')
        const signature = request.headers.get('stripe-signature') as string;

        const payload = await request.text();
        
        if (!signature) {
            return Response.json(`Webhook Error: No Signature`, {status: 400})
        }

        const event: Stripe.Event | undefined = await generateWebhookEvent(payload, signature)
        
        if (!event) {
            return Response.json(`Webhook Error: Unable to create event`, {status: 400})
        }
        
        switch (event.type) {
            case 'payment_intent.succeeded':
                handleInvoicePayment(event)
            case 'customer.subscription.updated':
                console.log('Subscription Being updated')
            default:
                Response.json(`Unhandled Event - ${event.type}`)
        }
    
        return Response.json('')
    } catch (err) {
        console.error(err, 'ERROR FROM CATCH')
        Response.json(`Webhook Error: ${err}`, {status: 400})
        return;
    }
}

