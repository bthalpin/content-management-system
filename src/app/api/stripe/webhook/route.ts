import { createCheckout, createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export async function POST(request: NextRequest) {
    const sig = request.headers.get('stripe-signature');

    let event;
    
    if (!sig) {
        return Response.json(`Webhook Error: No Signature`, {status: 400})
    }

    try {

            event = stripe.webhooks.constructEvent((await request.json()).body, sig, endpointSecret!);
        
    } catch (err) {
        Response.json(`Webhook Error: ${err}`, {status: 400})
        return;
    }
  
    // Handle the event
    console.log(`Unhandled event type ${event.type}`);
  

	return Response.json('')
}

