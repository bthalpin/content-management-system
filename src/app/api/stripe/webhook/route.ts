import { createCheckout, createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export async function POST(request: NextRequest) {
    try {
        console.log(endpointSecret, 'ARRIVED')
        const sig = request.headers.get('stripe-signature') as string;
console.log('SIG',sig)
        const payload = await request.text();
console.log(payload, 'PAYLOAD')
        
        if (!sig) {
            console.log('RETURNING NO SIG')
            return Response.json(`Webhook Error: No Signature`, {status: 400})
        }

console.log('BEFORE EVENT')
        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret!);
        console.log('AFTER EVENT', event)
        
        // Handle the event
        console.log(`Unhandled event type ${event.type}`);
    
    
        return Response.json('')
    } catch (err) {
        console.error(err, 'ERROR FROM CATCH')
        Response.json(`Webhook Error: ${err}`, {status: 400})
        return;
    }
}

