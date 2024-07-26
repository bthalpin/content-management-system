import { createCheckout, createCustomer } from '@/lib/stripe';
import { updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { user, url } = body;

    let customer = user.stripe_customer_id
    if (!customer) {
        const newCustomer = await createCustomer(user.name, user.email)

        if (newCustomer) {
            customer = newCustomer.id
            await updateUser({stripe_customer_id: customer}, user.user_id)
        }
    }

	const checkout = await createCheckout(user, url, customer)

	return Response.json(checkout)
}