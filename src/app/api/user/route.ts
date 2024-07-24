
import { createUser } from '@/lib/user';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { user } = body;

	const newUser = await createUser(user)

	return Response.json(newUser)
}