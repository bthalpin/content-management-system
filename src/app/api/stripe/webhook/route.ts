import { createCheckout, createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';
import { NextApiRequest } from 'next';
import { buffer } from 'micro'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

export async function POST(request: NextApiRequest) {
    try {
        
        const sig = request.headers['stripe-signature'];

        let event = request.body;

        const buf = await buffer(request)
        
        if (!sig) {
            return Response.json(`Webhook Error: No Signature`, {status: 400})
        }


        event = stripe.webhooks.constructEvent(buf, sig, endpointSecret!);
        
        
        // Handle the event
        console.log(`Unhandled event type ${event.type}`);
    
    
        return Response.json('')
    } catch (err) {
        Response.json(`Webhook Error: ${err}`, {status: 400})
        return;
    }
}

