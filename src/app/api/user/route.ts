
import { createUser, updateUser } from '@/lib/user';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { user } = body;

	const newUser = await createUser(user)

	return Response.json(newUser)
}

export async function PUT(request: NextRequest) {
	const body = await request.json()
	const { user } = body;

	const newUser = await updateUser(user, user.user_id)

	return Response.json(newUser)
}