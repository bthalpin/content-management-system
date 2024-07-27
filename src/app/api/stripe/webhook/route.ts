import { createCheckout, createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export async function POST(request: NextRequest) {
    try {
        
        const sig = request.headers.get('stripe-signature') as string;

        const payload = await request.text();

        
        if (!sig) {
            return Response.json(`Webhook Error: No Signature`, {status: 400})
        }


        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret!);
        
        
        // Handle the event
        console.log(`Unhandled event type ${event.type}`);
    
    
        return Response.json('')
    } catch (err) {
        Response.json(`Webhook Error: ${err}`, {status: 400})
        return;
    }
}

